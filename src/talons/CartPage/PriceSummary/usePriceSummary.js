const wrapUsePriceSummary = original => {
    return function usePriceSummary(props) {
        const { 
            ...defaults 
        } = original(props);
        
        const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session'))?.id; 
        const isAmazonCheckout = checkoutSessionId;

        return {
            isAmazonCheckout,
            ...defaults
        };
    };
};

export default wrapUsePriceSummary;
