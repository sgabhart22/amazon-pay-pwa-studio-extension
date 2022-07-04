import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './edit.module.css';
import PaymentMethod from './paymentMethod';

const EditAmazonPay = props => {
    const {
        onPaymentReady,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <PaymentMethod
                onPaymentReady={onPaymentReady}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
            />
        </div>
    );
};

export default EditAmazonPay;
