import { useEffect } from "react";
import useScript from '@magento/peregrine/lib/hooks/useScript';

const wrapUseShippingInformation = original => {
    return function useShippingInformation(props) {
        const { 
            handleEditShipping,
            isLoading,
            ...defaults 
        } = original(props);
        
        const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session'))?.id
        const isAmazonCheckout = checkoutSessionId;
        const amznScriptStatus = useScript("https://static-na.payments-amazon.com/checkout.js");
        
        var myHandleEditShipping = handleEditShipping;
        if (isAmazonCheckout) {
            myHandleEditShipping = () => {};
        }

        useEffect(() => {
            if (!isLoading) {
                if (isAmazonCheckout && amznScriptStatus === 'ready' ) {
                    const editSelector = '.shippingInformation-editButton-8ST';
                    if (document.querySelectorAll(editSelector).length) {
                        window.amazon.Pay.bindChangeAction(editSelector, {
                            amazonCheckoutSessionId: checkoutSessionId,
                            changeAction: 'changeAddress'
                        });
                    }
                }
            }
        });

        return {
            handleEditShipping: myHandleEditShipping,
            isLoading,
            ...defaults
        };
    };
};

export default wrapUseShippingInformation;
