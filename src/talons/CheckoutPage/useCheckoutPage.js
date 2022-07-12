import { useCallback, useEffect } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUpdateCheckoutSession } from '../AmazonCheckoutSession/useUpdateCheckoutSession';
import useScript from '@magento/peregrine/lib/hooks/useScript';

const wrapUseCheckoutPage = original => {
    return function useCheckoutPage(props) {
        const { 
            handlePlaceOrder,
            isLoading,
            ...defaults 
        } = original(props);
        
        const [{cartId}] = useCartContext();
        const amznScriptStatus = useScript("https://static-na.payments-amazon.com/checkout.js");
        
        const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session'))?.id; 
        const isAmazonCheckout = checkoutSessionId;

        const {
            loading: updateLoading,
            error: updateError,
            data: updateData, 
            updateCheckoutSession
        } = useUpdateCheckoutSession();

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
        }, [updateLoading, updateData]);

        useEffect(() => {
            if (isAmazonCheckout && amznScriptStatus === 'ready' && !isLoading) {
                const editSelector = '.shippingInformation-editButton-8ST';
                if (document.querySelectorAll(editSelector).length) {
                    window.amazon.Pay.bindChangeAction(editSelector, {
                        amazonCheckoutSessionId: checkoutSessionId,
                        changeAction: 'changeAddress'
                    });
                }
            }
        }, [amznScriptStatus, isLoading]);

        return {
            handlePlaceOrder: myHandlePlaceOrder,
            isLoading,
            ...defaults
        };
    };
};

export default wrapUseCheckoutPage;
