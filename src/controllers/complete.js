import React, { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import OrderConfirmationPage from '@magento/venia-ui/lib/components/CheckoutPage/OrderConfirmationPage';
import { useCompleteCheckoutSession } from '../talons/AmazonCheckoutSession/useCompleteCheckoutSession';
import { useCheckoutPage } from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const CompleteController = props => {    
    const checkoutSessionId = useQuery().get('amazonCheckoutSessionId');
    
    const {
        amazonOrderDetailsData,
        amazonOrderDetailsLoading
    } = useCheckoutPage();
    
    const {
        loading: completeLoading,
        error: completeError,
        data: completeData,
        completeCheckoutSession
    } = useCompleteCheckoutSession();

    const [{cartId}] = useCartContext();

    useEffect(() => {
        completeCheckoutSession({
            variables: {cartId: cartId, amazonSessionId: checkoutSessionId}
        });
    }, []);

    const controllerContent = (completeData && amazonOrderDetailsData) ? (
        <OrderConfirmationPage
            data={amazonOrderDetailsData}
            orderNumber={completeData.completeCheckoutSession.increment_id} />
        ) : (
        <LoadingIndicator />
        );

    const success = completeData?.completeCheckoutSession?.success;

    return completeError ? (
        <Redirect to="/cart"/>
    ): (
        <div>
            {controllerContent}
        </div>
    );
}

export default CompleteController;
