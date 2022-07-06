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

export const SET_GUEST_EMAIL_ON_CART = gql`
    mutation setGuestEmailOnCart($input: SetGuestEmailOnCartInput) {
        setGuestEmailOnCart(input: $input) {
            cart {
                id
            }
        }
    }
`;

export default {
    setShippingAddressesOnCart: SET_SHIPPING_ADDRESSES_ON_CART,
    setGuestEmailOnCart: SET_GUEST_EMAIL_ON_CART
};
