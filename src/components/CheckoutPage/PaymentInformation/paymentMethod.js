import React, { useEffect } from 'react';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import { useAmazonPaymentMethod } from '../../../talons/CheckoutPage/PaymentInformation/useAmazonPaymentMethod';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const PaymentMethod = props => {
    const { shouldSubmit, resetShouldSubmit } = props;
    
    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useAmazonPaymentMethod(props);

    const [{ drawer }, ] = useAppContext();

    useEffect(() => {
        if (drawer === 'paymentInformation.edit') {
            return;
        }

        onBillingAddressChangedSuccess();
    }, []);

    return (
        <BillingAddress
            resetShouldSubmit={resetShouldSubmit}
            shouldSubmit={shouldSubmit}
            onBillingAddressChangedError={onBillingAddressChangedError}
            onBillingAddressChangedSuccess={onBillingAddressChangedSuccess} />
    );
}

export default PaymentMethod;
