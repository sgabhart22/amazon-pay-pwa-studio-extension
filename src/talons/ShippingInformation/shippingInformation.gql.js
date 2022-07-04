import { gql } from '@apollo/client';

export const SET_SHIPPING_ADDRESSES_ON_CART = gql`
    mutation setShippingAddressesOnCart($input: SetShippingAddressesOnCartInput) {
        setShippingAddressesOnCart(input: $input) {
            cart {
                id
            }
        }
    }
`;

export default {
    setShippingAddressesOnCart: SET_SHIPPING_ADDRESSES_ON_CART
};
