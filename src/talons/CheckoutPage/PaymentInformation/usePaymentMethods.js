const wrapUsePaymentMethods = original => {
    return function usePaymentMethods(props) {
        const {
            availablePaymentMethods,
            initialSelectedMethod,
            ...defaults
        } = original(props);
    
        var myPaymentMethods = availablePaymentMethods;
    
        const isAmazonCheckout = localStorage.getItem('amazon-checkout-session');
        if (isAmazonCheckout) {
            myPaymentMethods = availablePaymentMethods.filter((method) => {
                return method.code === 'amazon_payment_v2';
            });
        }

        const myInitialSelectedMethod =
            (myPaymentMethods.length && myPaymentMethods[0].code) ||
            null;

        return {
            availablePaymentMethods: myPaymentMethods,
            initialSelectedMethod: myInitialSelectedMethod,
            ...defaults
        };
    }
};

export default wrapUsePaymentMethods;
