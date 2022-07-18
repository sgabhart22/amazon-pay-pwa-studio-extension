import React, { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import { useShippingInformation } from '../talons/ShippingInformation/useShippingInformation';
import { useBillingAddress } from '../talons/ShippingInformation/useBillingInformation';
import { useGuestEmail } from '../talons/ShippingInformation/useGuestEmail';
import { useAmazonAddress } from '../talons/AmazonCheckoutSession/useAmazonAddress';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const CheckoutController = props => {    
    const checkoutSessionId = useQuery().get('amazonCheckoutSessionId');
    localStorage.setItem('amazon-checkout-session', JSON.stringify({id: checkoutSessionId}));

    const {
        setShippingAddress,
        setShippingLoading,
        setShippingData,
        setShippingError
    } = useShippingInformation();

    const {
        setGuestEmail,
        guestEmailLoading,
        guestEmailError,
        guestEmailData
    } = useGuestEmail();

    const {
        setBillingAddress,
        setBillingLoading,
        setBillingData,
        setBillingError
    } = useBillingAddress();

    const talonProps = useAmazonAddress({
        amazonSessionId: checkoutSessionId,
        addressType: 'shipping'
    });
    const { loading, addressInput, emailInput } = talonProps;

    const billingTalonProps = useAmazonAddress({
        amazonSessionId: checkoutSessionId,
        addressType: 'billing'
    });
    const { loading: billingLoading, addressInput: billingAddressInput } = billingTalonProps;

    const doneLoading = (setShippingData || setShippingError)
        && (guestEmailData || guestEmailError)
        && (setBillingData || setBillingError)
        && addressInput
        && emailInput
        && billingAddressInput;

    useEffect(() => {
        if (addressInput && emailInput && billingAddressInput) {
            setShippingAddress({
                variables: {input: addressInput}
            });
            setGuestEmail({
                variables: {input: emailInput}
            });
            setBillingAddress({
                variables: {
                    cartId: billingAddressInput.cartId,
                    firstName: billingAddressInput.firstName,
                    lastName: billingAddressInput.lastName,
                    city: billingAddressInput.city,
                    postcode: billingAddressInput.postcode,
                    region: billingAddressInput.region,
                    country: billingAddressInput.country,
                    street1: billingAddressInput.street1,
                    street2: billingAddressInput.street2,
                    phoneNumber: billingAddressInput.phoneNumber
                }
            });
        }
    }, [addressInput, billingAddressInput, emailInput]);

    return doneLoading ? (
        <Redirect to="/checkout"/>
    ) : <LoadingIndicator/>

}

export default CheckoutController;
