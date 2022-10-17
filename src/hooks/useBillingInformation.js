import { gql, useMutation } from '@apollo/client';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/BillingAddress/billingAddress.gql';

export const useBillingAddress = props => {
    const { setBillingAddressMutation } = DEFAULT_OPERATIONS;
    const [
        setBillingAddress, {
            setBillingData,
            setBillingLoading,
            setBillingError
        }
    ] = useMutation(setBillingAddressMutation);

    const [
        setBillingSameAsShipping, {
            setBillingSameAsShippingData,
            setBillingSameAsShippingLoading,
            setBillingSameAsShippingError
        }
    ] = useMutation(SET_BILLING_SAME_AS_SHIPPING);

    return {
        setBillingAddress,
        setBillingLoading,
        setBillingData,
        setBillingError,
        setBillingSameAsShipping,
        setBillingSameAsShippingData,
        setBillingSameAsShippingLoading,
        setBillingSameAsShippingError
    };
};

export const SET_BILLING_SAME_AS_SHIPPING = gql`
    mutation setBillingAddress($cartId: String!) {
        setBillingAddressOnCart(
            input: {
                cart_id: $cartId
                billing_address: {
                    same_as_shipping: true
                }
            }
        ) {
            cart {
                id
                billing_address {
                    firstname
                    lastname
                    country {
                        code
                    }
                    street
                    city
                    region {
                        code
                    }
                    postcode
                    telephone
                }
            }
        }   
    }
`;
