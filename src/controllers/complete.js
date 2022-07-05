import React from 'react';
import { Redirect, useLocation } from 'react-router';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const CompleteController = props => {    
    const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session')).id;

    const talonProps = useAmazonShippingAddress({
        amazonSessionId: checkoutSessionId
    });
    const { loading, addressInput } = talonProps;

    useShippingInformation({input: addressInput});

    return (!loading && addressInput) ? (
        <Redirect to="/checkout"/>
    ) : <LoadingIndicator/>

}

export default CompleteController;
