const wrapUseCheckoutPage = original => {
    return function useCheckoutPage(props) {
        console.log('Wrapped!');

        return original(props);
    };
};

export default wrapUseCheckoutPage;
