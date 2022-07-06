import { gql } from '@apollo/client';

export const UPDATE_CHECKOUT_SESSION = gql`
    mutation updateCheckoutSession($cartId: String!, $amazonSessionId: String!) {
        updateCheckoutSession(cartId: $cartId, amazonSessionId: $amazonSessionId) {
            redirectUrl
        }
    }
`;

export default {
    updateCheckoutSessionMutation: UPDATE_CHECKOUT_SESSION
};
