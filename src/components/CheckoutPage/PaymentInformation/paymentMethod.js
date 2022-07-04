import React, { useEffect, useCallback } from 'react';
import { RestApi } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';
import { useMutation } from '@apollo/client';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import { useAmazonPaymentMethod } from '../../../talons/CheckoutPage/PaymentInformation/useAmazonPaymentMethod';
import { useAmazonPaymentDescriptor } from '../../../talons/AmazonCheckoutSession/useAmazonPaymentDescriptor';

import DEFAULT_OPERATIONS from '../../../talons/CheckoutPage/PaymentInformation/paymentInformation.gql';

const { request } = RestApi.Magento2;

const PaymentMethod = props => {
    const { resetShouldSubmit, onPaymentSuccess, onPaymentError } = props;
    
    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useAmazonPaymentMethod(props);

    const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session')).id
    const talonProps = useAmazonPaymentDescriptor({
        amazonSessionId: checkoutSessionId
    });
    const { paymentDescriptor } = talonProps;

    const paymentDescriptorContent = paymentDescriptor ? (
        <span>{paymentDescriptor.payment}</span>
    ) : null;

    useEffect(() => {
        if (paymentDescriptor) {
            console.log(paymentDescriptor);
        }
    }, [paymentDescriptor]);

    return (
        <div>
            {paymentDescriptorContent}
            <BillingAddress
                    resetShouldSubmit={resetShouldSubmit}
                    shouldSubmit={props.shouldSubmit}
                    onBillingAddressChangedError={onBillingAddressChangedError}
                    onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
                />
        </div>
    );
}

export default PaymentMethod;