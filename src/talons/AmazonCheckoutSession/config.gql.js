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

export default {
    getCheckoutSessionConfig: GET_AMAZON_CONFIG_DATA
};
