import { gql } from '@apollo/client';

export const COMPLETE_CHECKOUT_SESSION = gql`
    mutation completeCheckoutSession($cartId: String!, $amazonSessionId: String!) {
        completeCheckoutSession(cartId: $cartId, amazonSessionId: $amazonSessionId) {
            increment_id
            message
            success
        }
    }
`;

export default {
    completeCheckoutSession: COMPLETE_CHECKOUT_SESSION
};
