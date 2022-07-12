import { useCallback, useEffect } from 'react';
// import { useMutation } from '@apollo/client';
import { useUpdateCheckoutSession } from '../AmazonCheckoutSession/useUpdateCheckoutSession';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

// import DEFAULT_OPERATIONS from './PaymentInformation/paymentInformation.gql';
// import { useAmazonPaymentMethod } from './PaymentInformation/useAmazonPaymentMethod';

const wrapUseCheckoutPage = original => {
    return function useCheckoutPage(props) {
        const { 
            handlePlaceOrder,
            ...defaults 
        } = original(props);
        
        const [{cartId}] = useCartContext();
        
        const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session'))?.id; 
        const isAmazonCheckout = checkoutSessionId;

        // const { setAmazonPaymentMethodMutation } = DEFAULT_OPERATIONS;

        const {
            loading: updateLoading,
            error: updateError,
            data: updateData, 
            updateCheckoutSession
        } = useUpdateCheckoutSession();

        // const [
        //     setPaymentMethod, 
        //     {
        //         error: paymentMethodMutationError,
        //         called: paymentMethodMutationCalled,
        //         loading: paymentMethodMutationLoading
        //     }
        // ] = useMutation(setAmazonPaymentMethodMutation);

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
