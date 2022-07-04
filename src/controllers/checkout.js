import React from 'react';
import { Redirect, useLocation } from 'react-router';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import { useShippingInformation } from '../talons/ShippingInformation/useShippingInformation';
import { useAmazonShippingAddress } from '../talons/AmazonCheckoutSession/useAmazonShippingAddress';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const CheckoutController = props => {    
    const checkoutSessionId = useQuery().get('amazonCheckoutSessionId');
    localStorage.setItem('amazon-checkout-session', JSON.stringify({id: checkoutSessionId}));

    const talonProps = useAmazonShippingAddress({
        amazonSessionId: checkoutSessionId
    });
    const { loading, addressInput } = talonProps;

    useShippingInformation({input: addressInput});

    return (!loading && addressInput) ? (
        <Redirect to="/checkout"/>
    ) : <LoadingIndicator/>

}

export default CheckoutController;