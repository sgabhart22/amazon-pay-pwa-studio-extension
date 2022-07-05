import { gql } from '@apollo/client';

export const UPDATE_CHECKOUT_SESSION = gql`
    mutation updateCheckoutSession($cartId: String!, $amazonSessionId: String!) {
        updateCheckoutSession(cartId: $cartId, amazonSessionId: $amazonSessionId) {
            redirectUrl
        }
    }
`;

export default {
    updateCheckoutSession: UPDATE_CHECKOUT_SESSION
};
