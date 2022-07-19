import React, { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import { useShippingInformation } from '../hooks/useShippingInformation';
import { useBillingAddress } from '../hooks/useBillingInformation';
import { useCustomerEmail } from '../hooks/useCustomerEmail';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAmazonCheckout } from '../talons/AmazonCheckoutSession/useAmazonCheckout';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const CheckoutController = props => {    
    const checkoutSessionId = useQuery().get('amazonCheckoutSessionId');
    localStorage.setItem('amazon-checkout-session', JSON.stringify({id: checkoutSessionId}));

    const [{ isSignedIn }] = useUserContext();

    const {
        setShippingAddress,
        setShippingLoading,
        setShippingData,
        setShippingError
    } = useShippingInformation();

    const {
        setGuestEmail,
        customerEmailLoading,
        customerEmailError,
        customerEmailData
    } = useCustomerEmail();

    const {
        setBillingAddress,
        setBillingLoading,
        setBillingData,
        setBillingError
    } = useBillingAddress();

    const {
        amazonShippingAddress,
        amazonBillingAddress,
        amazonEmail
    } = useAmazonCheckout({amazonSessionId: checkoutSessionId});

    const doneLoading = (setShippingData || setShippingError)
        && (customerEmailData || customerEmailError)
        && (setBillingData || setBillingError)
        && amazonShippingAddress
        && amazonBillingAddress
        && amazonEmail;

    useEffect(() => {
        if (amazonShippingAddress && amazonEmail && amazonBillingAddress) {
            if (!isSignedIn) {
                setGuestEmail({
                    variables: {input: amazonEmail}
                });
            }
            
            setShippingAddress({
                variables: {input: amazonShippingAddress}
            });
            setBillingAddress({
                variables: {
                    cartId: amazonBillingAddress.cartId,
                    firstName: amazonBillingAddress.firstName,
                    lastName: amazonBillingAddress.lastName,
                    city: amazonBillingAddress.city,
                    postcode: amazonBillingAddress.postcode,
                    region: amazonBillingAddress.region,
                    country: amazonBillingAddress.country,
                    street1: amazonBillingAddress.street1,
                    street2: amazonBillingAddress.street2,
                    phoneNumber: amazonBillingAddress.phoneNumber
                }
            });
        }
    }, [amazonShippingAddress, amazonBillingAddress, amazonEmail]);

    return doneLoading ? (
        <Redirect to="/checkout"/>
    ) : <LoadingIndicator/>

}

export default CheckoutController;
