import React, { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import { useShippingInformation } from '../talons/ShippingInformation/useShippingInformation';
import { useGuestEmail } from '../talons/ShippingInformation/useGuestEmail';
import { useAmazonShippingAddress } from '../talons/AmazonCheckoutSession/useAmazonShippingAddress';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const CheckoutController = props => {    
    const checkoutSessionId = useQuery().get('amazonCheckoutSessionId');
    localStorage.setItem('amazon-checkout-session', JSON.stringify({id: checkoutSessionId}));

    const {
        setShippingAddress,
        setShippingLoading,
        setShippingData,
        setShippingError
    } = useShippingInformation();

    const {
        setGuestEmail,
        guestEmailLoading,
        guestEmailError,
        guestEmailData
    } = useGuestEmail();

    const talonProps = useAmazonShippingAddress({
        amazonSessionId: checkoutSessionId
    });
    const { loading, addressInput, emailInput } = talonProps;

    const doneLoading = setShippingData
        && guestEmailData
        && addressInput
        && emailInput;

    useEffect(() => {
        if (addressInput && emailInput) {
            setShippingAddress({
                variables: {input: addressInput}
            });
            setGuestEmail({
                variables: {input: emailInput}
            });
        }
    }, [addressInput, emailInput]);

    return doneLoading ? (
        <Redirect to="/checkout"/>
    ) : <LoadingIndicator/>

}

export default CheckoutController;
