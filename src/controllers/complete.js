import React, { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router';
import { useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import OrderConfirmationPage from '@magento/venia-ui/lib/components/CheckoutPage/OrderConfirmationPage';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/checkoutPage.gql.js';
import { useAmazonCheckout } from '../talons/AmazonCheckoutSession/useAmazonCheckout';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const CompleteController = props => {    
    const checkoutSessionId = useQuery().get('amazonCheckoutSessionId');
    const { getOrderDetailsQuery, createCartMutation } = DEFAULT_OPERATIONS;
    
    const [
        getOrderDetails,
        { data: amazonOrderDetailsData }
    ] = useLazyQuery(getOrderDetailsQuery, {
        fetchPolicy: 'no-cache'
    });

    const {
        completeCheckoutSession,
        completeCheckoutSessionData,
        completeCheckoutSessionError
    } = useAmazonCheckout();

    const apolloClient = useApolloClient();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();
    const [fetchCartId] = useMutation(createCartMutation);

    useEffect(async () => {
        await getOrderDetails({
            variables: {
                cartId
            }
        });

        completeCheckoutSession({
            variables: {cartId: cartId, amazonSessionId: checkoutSessionId}
        });

        localStorage.removeItem('amazon-checkout-session');
        await removeCart();
        await apolloClient.clearCacheData(apolloClient, 'cart');

        await createCart({
            fetchCartId
        });

        window.history.replaceState(null, null, '/checkout/success');
    }, []);

    const controllerContent = (completeCheckoutSessionData && amazonOrderDetailsData) ? (
        <OrderConfirmationPage
            data={amazonOrderDetailsData}
            orderNumber={completeCheckoutSessionData.completeCheckoutSession.increment_id} />
        ) : (
        <LoadingIndicator />
        );

    return completeCheckoutSessionError ? (
        <Redirect to="/cart"/>
    ): (
        <div>
            {controllerContent}
        </div>
    );
}

export default CompleteController;
