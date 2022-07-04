import { gql } from '@apollo/client';

export const SET_AMAZON_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: "amazon_payment_v2" } }
        ) {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export default {
    setAmazonPaymentMethodMutation: SET_AMAZON_PAYMENT_METHOD_ON_CART
};
