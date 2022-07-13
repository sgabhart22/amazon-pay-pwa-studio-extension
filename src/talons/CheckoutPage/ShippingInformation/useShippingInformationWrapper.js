const wrapUseShippingInformation = original => {
    return function useShippingInformation(props) {
        const { 
            handleEditShipping,
            ...defaults 
        } = original(props);
        
        const isAmazonCheckout = JSON.parse(localStorage.getItem('amazon-checkout-session'))?.id;
        
        var myHandleEditShipping = handleEditShipping;
        if (isAmazonCheckout) {
            myHandleEditShipping = () => {};
        }

        return {
            handleEditShipping: myHandleEditShipping,
            ...defaults
        };
    };
};

export default wrapUseShippingInformation;
