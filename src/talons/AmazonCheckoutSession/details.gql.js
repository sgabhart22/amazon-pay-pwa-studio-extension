import { gql } from '@apollo/client';

export const GET_CHECKOUT_SESSION_DETAILS = gql`
    query checkoutSessionDetails($amazonSessionId: String!, $queryTypes: [String!]) {
        checkoutSessionDetails(amazonSessionId: $amazonSessionId, queryTypes: $queryTypes) {
            response
        }
    }
`;

export default {
    getCheckoutSessionDetails: GET_CHECKOUT_SESSION_DETAILS
};
