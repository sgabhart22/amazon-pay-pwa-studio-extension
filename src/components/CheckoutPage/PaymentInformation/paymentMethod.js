import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import { useAmazonPaymentMethod } from '../../../talons/CheckoutPage/PaymentInformation/useAmazonPaymentMethod';
import { useAmazonPaymentDescriptor } from '../../../talons/AmazonCheckoutSession/useAmazonPaymentDescriptor';
import AddressCard from '@magento/venia-ui/lib/components/CheckoutPage/AddressBook/addressCard';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

const PaymentMethod = props => {
    const { resetShouldSubmit } = props;

    const getBillingAddressQuery = GET_BILLING_ADDRESS;
    const [{ cartId }] = useCartContext();
    const [billingCardData, setBillingCardData] = useState(null);
    const [useAmazonBilling, setUseAmazonBilling] = useState(true);
    
    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useAmazonPaymentMethod(props);

    const { loading: billingLoading, data: billingData, error: billingError } = useQuery(getBillingAddressQuery, {
        variables: {cartId: cartId}
    });

    const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session')).id
    const talonProps = useAmazonPaymentDescriptor({
        amazonSessionId: checkoutSessionId
    });
    const { paymentDescriptor } = talonProps;

    const paymentDescriptorContent = paymentDescriptor ? (
        <span>{paymentDescriptor.payment}</span>
    ) : null;

    const editBilling = () => {
        setUseAmazonBilling(false);
    }
    // billingCardData && useAmazonBilling ?
    const billingDisplay = (
    //     <AddressCard
    //         address={billingCardData}
    //         isSelected={true}
    //         onSelection={() => {}}
    //         onEdit={editBilling} />
    // ) : (
        <BillingAddress
            resetShouldSubmit={resetShouldSubmit}
            shouldSubmit={props.shouldSubmit}
            onBillingAddressChangedError={onBillingAddressChangedError}
            onBillingAddressChangedSuccess={onBillingAddressChangedSuccess} />
    );

    useEffect(() => {
        if (billingData && !billingCardData) {
            const rawAddress = billingData.cart.billingAddress;
            const addressData = {
                firstname: rawAddress.firstName,
                lastname: rawAddress.lastName,
                city: rawAddress.city,
                country_code: rawAddress.country.code,
                default_shipping: false,
                postcode: rawAddress.postcode,
                region: {
                    region_code: rawAddress.region.code,
                    region: rawAddress.region.label
                },
                street: rawAddress.street
            };
            
            setBillingCardData(addressData);
        }

        if (billingCardData && useAmazonBilling) {
            onBillingAddressChangedSuccess();
        }
    }, [billingData, billingCardData, useAmazonBilling]);

    return (
        <div>
            {paymentDescriptorContent}
            {billingDisplay}
        </div>
    );
}

export const GET_BILLING_ADDRESS = gql`
    query getBillingAddress($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            billingAddress: billing_address {
                firstName: firstname
                lastName: lastname
                country {
                    code
                }
                street
                city
                region {
                    code
                    label
                }
                postcode
                phoneNumber: telephone
            }
        }
    }
`;

export default PaymentMethod;
