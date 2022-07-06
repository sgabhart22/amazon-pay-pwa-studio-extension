import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/checkoutPage.gql.js';
import { useUpdateCheckoutSession } from '../AmazonCheckoutSession/useUpdateCheckoutSession';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

const wrapUseCheckoutPage = original => {
    return function useCheckoutPage(props) {
        const { 
            handlePlaceOrder,
            ...defaults 
        } = original(props);

        const { getOrderDetailsQuery } = DEFAULT_OPERATIONS;
        const [{cartId}] = useCartContext();
        
        const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session'))?.id; 
        const isAmazonCheckout = checkoutSessionId;

        const {loading: updateLoading, error: updateError, data: updateData, updateCheckoutSession} = useUpdateCheckoutSession();

        const [
            getOrderDetails,
            { data: amazonOrderDetailsData, loading: amazonOrderDetailsLoading }
        ] = useLazyQuery(getOrderDetailsQuery, {
            fetchPolicy: 'no-cache'
        });

        var myHandlePlaceOrder = handlePlaceOrder;
        if (isAmazonCheckout) {
            myHandlePlaceOrder = useCallback(async () => {
                await getOrderDetails({
                    variables: {
                        cartId
                    }
                });

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
            amazonOrderDetailsData,
            amazonOrderDetailsLoading,
            ...defaults
        };
    };
};

export default wrapUseCheckoutPage;
