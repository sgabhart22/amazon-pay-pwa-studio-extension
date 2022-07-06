import { useCallback, useEffect, useState } from 'react';


import { useUpdateCheckoutSession } from '../AmazonCheckoutSession/useUpdateCheckoutSession';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

const wrapUseCheckoutPage = original => {
    return function useCheckoutPage(props) {
        const { 
            handlePlaceOrder,
            ...defaults 
        } = original(props);

        const [{cartId}] = useCartContext();
        
        const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session'))?.id; 
        const isAmazonCheckout = checkoutSessionId;

        const {loading: updateLoading, error: updateError, data: updateData, updateCheckoutSession} = useUpdateCheckoutSession();

        var myHandlePlaceOrder = handlePlaceOrder;
        if (isAmazonCheckout) {
            myHandlePlaceOrder = useCallback(async () => {
                updateCheckoutSession({
                    variables: {cartId: cartId, amazonSessionId: checkoutSessionId}
                });
            }, [cartId]);
        }

        useEffect(() => {
            if (!updateLoading && updateData) {
                const redirectUrl = updateData.updateCheckoutSession.redirectUrl;
                window.location.href = redirectUrl;
            }
        }, [updateLoading, updateData])

        return {
            handlePlaceOrder: myHandlePlaceOrder,
            ...defaults
        };
    };
};

export default wrapUseCheckoutPage;
