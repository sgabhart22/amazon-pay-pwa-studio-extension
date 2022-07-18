import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Redirect, useLocation } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';

import { useApolloClient, useMutation } from '@apollo/client';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { RestApi, useToasts } from '@magento/peregrine';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Form } from 'informed';
import FormError from '@magento/venia-ui/lib/components/FormError/formError';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/SignIn/signIn.gql';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './amazon-sign-in.css';
import Password from '@magento/venia-ui/lib/components/Password';
import Button from '@magento/venia-ui/lib/components/Button';

const { request } = RestApi.Magento2;

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const AmazonSignIn = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const { getCartDetailsQuery } = props;
    
    const buyerToken = useQuery().get('buyerToken');

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createCartMutation,
        getCustomerQuery,
        mergeCartsMutation
    } = operations;

    const apolloClient = useApolloClient();

    const [
        {},
        { getUserDetails, setToken }
    ] = useUserContext();

    const [
        { cartId },
        { createCart, removeCart, getCartDetails }
    ] = useCartContext();

    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const [formErrors, setFormErrors] = useState([]);
    const [, { addToast }] = useToasts();

    const [tokenRetrieved, setTokenRetrieved] = useState(false);
    const [userExists, setUserExists] = useState(false);

    const handleSubmit = (({password}) => {
        const body = {
            buyerToken: buyerToken,
            password: password
        };

        request('/rest/V1/amazon-checkout-session/setcustomerlink', {method: 'POST', body: JSON.stringify(body)})
            .then(async (response) => {
                const signInResponse = response[0];

                if (!signInResponse.success) {
                    setFormErrors([{
                        name: 'Bad Password',
                        message: signInResponse.message
                    }]);

                    return;
                }

                try {
                    signIn(signInResponse);
                } catch (error) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(error);
                    }
                }
            });
    });

    const signIn = async (signInResponse) => {
        if (!signInResponse.success) {
            if (signInResponse.customer_email) {
                setUserExists(true);
            } else {
                addToast({
                    type: 'error',
                    message: signInResponse.message,
                    dismissable: true,
                    timeout: 10
                });

                return (
                    <Redirect to="/" />
                );
            }
        }
        
        if (signInResponse.customer_bearer_token) {
            await setToken(signInResponse.customer_bearer_token);
            setTokenRetrieved(true);

            // Get source cart id (guest cart id).
            const sourceCartId = cartId;
            // Clear all cart/customer data from cache and redux.
            await clearCartDataFromCache(apolloClient);
            await clearCustomerDataFromCache(apolloClient);
            await removeCart();

            // Create and get the customer's cart id.
            await createCart({
                fetchCartId
            });
            const destinationCartId = await retrieveCartId();

            // Merge the guest cart into the customer cart.
            await mergeCarts({
                variables: {
                    destinationCartId,
                    sourceCartId
                }
            });

            // Ensure old stores are updated with any new data.
            getUserDetails({ fetchUserDetails });
            getCartDetails({ fetchCartId, fetchCartDetails });
        }
    }

    useEffect(() => {
        request(`/rest/V1/amazon-checkout-session/signin/${buyerToken}`, { method: 'GET', accept: 'application/json' })
            .then(async (response) => {
                const signInResponse = response[0];

                try {
                    signIn(signInResponse);
                } catch (error) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(error);
                    }
                }
            });
    }, []);

    if (tokenRetrieved) {
        return (
            <Redirect to="/account-information"></Redirect>
        );
    } else if (userExists) { 
        return (
            <div className={classes.root}>
                <FormError errors={formErrors} />
                <Form
                    getApi={setFormApi}
                    className={classes.form}
                    onSubmit={handleSubmit}>
                    <Password
                        fieldName="password"
                        label={formatMessage({
                            id: 'signIn.passwordText',
                            defaultMessage: 'Password'
                        })}
                        validate={isRequired}
                        autoComplete="current-password"
                        isToggleButtonHidden={false}
                    />
                    <Button priority="high" type="submit">
                        <FormattedMessage
                            id={'signIn.signInText'}
                            defaultMessage={'Sign In'}
                        />
                    </Button>
                </Form>
            </div>
        );
    } else {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'signIn.loadingText'}
                    defaultMessage={'Signing In'}
                />
            </LoadingIndicator>
        );
    }
}

export default AmazonSignIn;
