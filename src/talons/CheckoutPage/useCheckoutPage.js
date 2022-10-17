import { useCallback, useEffect } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAmazonCheckout } from '../AmazonCheckoutSession/useAmazonCheckout';

const wrapUseCheckoutPage = original => {
    return function useCheckoutPage(props) {
        const { 
            handlePlaceOrder,
            ...defaults 
        } = original(props);
        
        const [{ cartId }] = useCartContext();
        
        const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session'))?.id; 
        const isAmazonCheckout = checkoutSessionId;

        const {
            updateCheckoutSession,
            updateCheckoutSessionLoading,
            updateCheckoutSessionData
        } = useAmazonCheckout();

        var myHandlePlaceOrder = handlePlaceOrder;
       
        if (isAmazonCheckout) {
            myHandlePlaceOrder = useCallback(async () => {
                updateCheckoutSession({
                    variables: {cartId: cartId, amazonSessionId: checkoutSessionId}
                });
            }, [cartId]);
        }

        useEffect(() => {
            if (!updateCheckoutSessionLoading && updateCheckoutSessionData) {
                const redirectUrl = updateCheckoutSessionData.updateCheckoutSession.redirectUrl;
                window.location.href = redirectUrl;
            }
        }, [updateCheckoutSessionLoading, updateCheckoutSessionData]);

        return {
            handlePlaceOrder: myHandlePlaceOrder,
            ...defaults
        };
    };
};

export default wrapUseCheckoutPage;
