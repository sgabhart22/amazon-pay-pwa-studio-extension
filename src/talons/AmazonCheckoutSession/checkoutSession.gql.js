import { gql } from '@apollo/client';

export const GET_AMAZON_CONFIG_DATA = gql`
    query checkoutSessionConfig($cartId: String) {
        checkoutSessionConfig(cartId: $cartId) {
            button_color
            checkout_payload
            checkout_signature
            currency
            sandbox
            language
            login_payload
            login_signature
            merchant_id
            pay_only
            paynow_payload
            paynow_signature
            public_key_id
        }
    }
`;

export const GET_CHECKOUT_SESSION_DETAILS = gql`
    query checkoutSessionDetails($amazonSessionId: String!, $queryTypes: [String!]) {
        checkoutSessionDetails(amazonSessionId: $amazonSessionId, queryTypes: $queryTypes) {
            response
        }
    }
`;

export const UPDATE_CHECKOUT_SESSION = gql`
    mutation updateCheckoutSession($cartId: String!, $amazonSessionId: String!) {
        updateCheckoutSession(cartId: $cartId, amazonSessionId: $amazonSessionId) {
            redirectUrl
        }
    }
`;

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
    getCheckoutSessionConfig: GET_AMAZON_CONFIG_DATA,
    getCheckoutSessionDetails: GET_CHECKOUT_SESSION_DETAILS,
    updateCheckoutSessionMutation: UPDATE_CHECKOUT_SESSION,
    completeCheckoutSessionMutation: COMPLETE_CHECKOUT_SESSION
};
