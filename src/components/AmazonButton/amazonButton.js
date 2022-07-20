import React, { useState, useEffect } from 'react';
import { string } from 'prop-types';

import useScript from '@magento/peregrine/lib/hooks/useScript';
import defaultClasses from './amazonButton.module.css';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import { useAmazonCheckout } from '../../talons/AmazonCheckoutSession/useAmazonCheckout';

const AmazonButton = props => {
    const { amazonConfig } = useAmazonCheckout();
    const classes = useStyle(defaultClasses, props.classes);

    const amznScriptStatus = useScript("https://static-na.payments-amazon.com/checkout.js");
    const [amznLoading, setAmznLoading] = useState(true);

    const productType = props.productType === 'checkout' ?
        'PayAndShip'
        : 'SignIn';

    const buttonId = 'AmazonButton_' + props.placement;

    useEffect(() => {
        if (amazonConfig && amznScriptStatus === 'ready') {
            
            const buttonConfig = { 
                merchantId: amazonConfig.merchant_id,
                publicKeyId: amazonConfig.public_key_id,
                ledgerCurrency: amazonConfig.currency,
                checkoutLanguage: amazonConfig.language,
                productType: productType,
                placement: props.placement,
                buttonColor: amazonConfig.button_color,
                sandbox: amazonConfig.sandbox
            };
            setAmznLoading(false);

            if (productType === 'SignIn') {
                buttonConfig.signInConfig = {
                    payloadJSON: amazonConfig.login_payload,
                    signature: amazonConfig.login_signature
                };
            } else {
                buttonConfig.createCheckoutSessionConfig = {
                    payloadJSON: amazonConfig.checkout_payload,
                    signature: amazonConfig.checkout_signature
                };
            }

            try {
                amazon.Pay.renderButton(`#${buttonId}`, buttonConfig);
            } catch (err) {
                console.log("Failed to render Amazon Pay button: " + err);
                return;
            }
        }
    }, [amazonConfig, amznScriptStatus]);

    return amznLoading ? (
        <div id={buttonId}>
            <Shimmer width={10}/>
        </div>
     ) : (
        <div id={buttonId} className={classes.amazonButton} />
     );
};

AmazonButton.propTypes = {
    placement: string,
    productType: string.isRequired
};

export default AmazonButton;
