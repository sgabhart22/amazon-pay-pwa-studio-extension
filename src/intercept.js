const { Targetables } = require("@magento/pwa-buildpack");

module.exports = (targets) => {
    const targetables = Targetables.using(targets);

	targets.of('@magento/pwa-buildpack').specialFeatures.tap(features => {
        features[targets.name] = {esModules: true, cssModules: true};
    });

    const {
        checkoutPagePaymentTypes,
        editablePaymentTypes,
        summaryPagePaymentTypes,
        routes
    } = targets.of('@magento/venia-ui');

    routes.tap(
        routesArray => {
            routesArray.push({
                name: 'Amazon Checkout Review Return URL',
                pattern: '/amazon_pay/login/checkout',
                path: 'extensions/@bg/amazon-pay-pwa-studio/src/controllers/checkout'
            });

            routesArray.push({
                name: 'Amazon Checkout Result Return URL',
                pattern: '/amazon_pay/checkout/completeSession',
                path: 'extensions/@bg/amazon-pay-pwa-studio/src/controllers/complete'
            });

            routesArray.push({
                name: 'Amazon Sign In Result Return URL',
                pattern: '/amazon_pay/login/authorize',
                path: 'extensions/@bg/amazon-pay-pwa-studio/src/controllers/signin'
            });

            return routesArray;
        }
    );

    checkoutPagePaymentTypes.tap(
        checkoutPagePaymentTypes => {
            checkoutPagePaymentTypes.add({
                paymentCode: 'amazon_payment_v2',
                importPath: 'extensions/@bg/amazon-pay-pwa-studio/src/components/CheckoutPage/PaymentInformation/paymentMethod.js'
            });

            return checkoutPagePaymentTypes;
        }
    );

    editablePaymentTypes.tap(
        editablePaymentTypes => {
            editablePaymentTypes.add({
                paymentCode: 'amazon_payment_v2',
                importPath:
                'extensions/@bg/amazon-pay-pwa-studio/src/components/CheckoutPage/PaymentInformation/edit.js'
            });

            return editablePaymentTypes;
        }
    );

    summaryPagePaymentTypes.tap(
        paymentSummaries => {
            paymentSummaries.add({
                paymentCode: 'amazon_payment_v2',
                importPath:
                    'extensions/@bg/amazon-pay-pwa-studio/src/components/CheckoutPage/PaymentInformation/summary.js'
            });

            return paymentSummaries;
        }
    );

    const MiniCartComponent = targetables.module(
        '@magento/venia-ui/lib/components/MiniCart/miniCart.js'
    );
    const PdpComponent = targetables.module(
        '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js'
    );
    const PriceSummaryComponent = targetables.module(
        '@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.js'
    );
    const SignInComponent = targetables.module(
        '@magento/venia-ui/lib/components/SignIn/signIn.js'
    );

    MiniCartComponent.insertAfterSource(
        './ProductList\';',
        '\nimport AmazonButton from \'@bg/amazon-pay-pwa-studio/src/components/AmazonButton\';\n'
    );
    MiniCartComponent.insertAfterSource(
        'defaultMessage={\'CHECKOUT\'}\n                    />\n                </Button>\n',
        '\t\t\t\t<AmazonButton productType={\'checkout\'} placement={\'Cart\'}/>\n'
    );
    PdpComponent.insertAfterSource(
        './CustomAttributes\';',
        '\nimport AmazonButton from \'@bg/amazon-pay-pwa-studio/src/components/AmazonButton\';\n'
    );
    PdpComponent.insertAfterSource(
        '{cartActionContent}',
        '\n\t\t\t\t\t<AmazonButton productType={\'checkout\'} placement={\'Product\'} handleAddToCart={handleAddToCart}/>'
    );
    PriceSummaryComponent.insertAfterSource(
        './taxSummary\';',
        '\nimport AmazonButton from \'@bg/amazon-pay-pwa-studio/src/components/AmazonButton\';\n'
    );
    PriceSummaryComponent.insertAfterSource(
        'handleProceedToCheckout,\n',
        '        isAmazonCheckout,\n'
    );
    PriceSummaryComponent.insertAfterSource(
        ': null;\n',
        '\nconst amazonButtonContent = !isAmazonCheckout ? <AmazonButton productType={\'checkout\'} placement={\'Cart\'}/> : null;\n'
    );
    PriceSummaryComponent.insertAfterSource(
        '{proceedToCheckoutButton}\n',
        '            {amazonButtonContent}\n'
    );
    SignInComponent.insertAfterSource(
        'import GoogleRecaptcha from \'../GoogleReCaptcha\';',
        '\nimport AmazonButton from \'@bg/amazon-pay-pwa-studio/src/components/AmazonButton\';\n'
    );
    SignInComponent.insertAfterSource(
        'defaultMessage={\'Create an Account\'}\n                        />\n                    </Button>\n',
        '\t\t\t\t\t<AmazonButton productType={\'signin\'} placement={\'Other\'}/>\n'
    );

    const peregrineTargets = targets.of("@magento/peregrine");
    const talonsTarget = peregrineTargets.talons;

    talonsTarget.tap((talonWrapperConfig) => {
        talonWrapperConfig.CheckoutPage.useCheckoutPage.wrapWith(
            '@bg/amazon-pay-pwa-studio/src/talons/CheckoutPage/useCheckoutPage.js'
        );
        talonWrapperConfig.CheckoutPage.PaymentInformation.usePaymentMethods.wrapWith(
            '@bg/amazon-pay-pwa-studio/src/talons/CheckoutPage/PaymentInformation/usePaymentMethods.js'
        );
        talonWrapperConfig.CheckoutPage.ShippingInformation.useShippingInformation.wrapWith(
            '@bg/amazon-pay-pwa-studio/src/talons/CheckoutPage/ShippingInformation/useShippingInformationWrapper.js'
        );
        talonWrapperConfig.CheckoutPage.PaymentInformation.usePaymentInformation.wrapWith(
            '@bg/amazon-pay-pwa-studio/src/talons/CheckoutPage/PaymentInformation/usePaymentInformationWrapper.js'
        );
        // @magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary
        talonWrapperConfig.CartPage.PriceSummary.usePriceSummary.wrapWith(
            '@bg/amazon-pay-pwa-studio/src/talons/CartPage/PriceSummary/usePriceSummary.js'
        );
    });
};
