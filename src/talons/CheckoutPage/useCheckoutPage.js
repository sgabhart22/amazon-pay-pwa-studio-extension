import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateCheckoutSession } from '../AmazonCheckoutSession/useUpdateCheckoutSession';

const wrapUseCheckoutPage = original => {
    return function useCheckoutPage(props) {
        const { handlePlaceOrder, ...defaults } = original(props);
        const navigate = useNavigate();
        
        const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session'))?.id; 
        const isAmazonCheckout = checkoutSessionId;

        var myHandlePlaceOrder;
        if (isAmazonCheckout) {
            const { redirectUrl } = useUpdateCheckoutSession({checkoutSessionId: checkoutSessionId});

            myHandlePlaceOrder = useCallback(() => {
                navigate(redirectUrl);
            }, [redirectUrl]);
        } else {
            myHandlePlaceOrder = handlePlaceOrder;
        }        

        return {
            handlePlaceOrder: myHandlePlaceOrder,
            ...defaults
        };
    };
};

export default wrapUseCheckoutPage;
