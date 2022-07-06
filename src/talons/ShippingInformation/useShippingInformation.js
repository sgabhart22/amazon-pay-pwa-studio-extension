import { useMutation } from '@apollo/client';
import DEFAULT_OPERATIONS from './shippingInformation.gql';

export const useShippingInformation = props => {
    const { setShippingAddressesOnCart } = DEFAULT_OPERATIONS;
    const [setShippingAddress, {data, loading, error}] = useMutation(setShippingAddressesOnCart);
    // const input = props.input;

    // setShippingAddress({
    //     variables: {input: input},
    //     errorPolicy: 'ignore'
    // });
    
    // const cartId = data ?
    //     data.setShippingAddressesOnCart.cart.id :
    //     null;

    return {
        setShippingLoading: loading,
        setShippingError: error,
        setShippingData: data,
        setShippingAddress  
    };
};
