import { gql, useMutation } from '@apollo/client';

export const useShippingInformation = props => {
    const [setShippingAddress, {data, loading, error}] = useMutation(SET_SHIPPING_ADDRESSES_ON_CART);

    return {
        setShippingLoading: loading,
        setShippingError: error,
        setShippingData: data,
        setShippingAddress  
    };
};

export const SET_SHIPPING_ADDRESSES_ON_CART = gql`
    mutation setShippingAddressesOnCart($input: SetShippingAddressesOnCartInput) {
        setShippingAddressesOnCart(input: $input) {
            cart {
                id
            }
        }
    }
`;
