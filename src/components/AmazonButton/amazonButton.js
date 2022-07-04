import React, { useState, useEffect, Fragment } from 'react';
import { string } from 'prop-types';

import { useAmazonConfig } from '../../talons/AmazonCheckoutSession/useAmazonConfig';
import useScript from '@magento/peregrine/lib/hooks/useScript';
import defaultClasses from './amazonButton.module.css';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const AmazonButton = props => {
    const talonProps = useAmazonConfig();
    const { loading, error, amazonConfig } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    const amznScriptStatus = useScript("https://static-na.payments-amazon.com/checkout.js");
    const [amznLoading, setAmznLoading] = useState(true);

    // TODO: modularize to allow for paynow/sign in usage
    useEffect(() => {
        if (!loading) {
            if (amznScriptStatus === 'ready') {
                const buttonConfig = { 
                    merchantId: amazonConfig.merchant_id,
                    publicKeyId: amazonConfig.public_key_id,
                    ledgerCurrency: amazonConfig.currency,
                    checkoutLanguage: amazonConfig.language,
                    productType: 'PayAndShip',
                    placement: 'Other',
                    buttonColor: amazonConfig.button_color,
                    createCheckoutSessionConfig: {
                        payloadJSON: amazonConfig.checkout_payload,
                        signature: amazonConfig.checkout_signature
                    },
                    sandbox: amazonConfig.sandbox
                };
                setAmznLoading(false);

                window.amazon.Pay.renderButton('#AmazonButton', buttonConfig);
            }
        }
    }, [amznScriptStatus, loading]);

    return amznLoading ? (
        <div id='AmazonButton'>
            <Shimmer width={10}/>
        </div>
     ) : (
        <div id='AmazonButton' className={classes.amazonButton}/>
     );
};

AmazonButton.propTypes = {
    placement: string,
    productType: string
};

export default AmazonButton;
