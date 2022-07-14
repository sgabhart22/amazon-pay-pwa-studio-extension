const { Targetables } = require("@magento/pwa-buildpack");

module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        flags[targets.name] = {esModules: true, cssModules: true};
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
                path: 'extensions/@amzn/amazon-pay-pwa-studio-extension/src/controllers/checkout'
            });

            routesArray.push({
                name: 'Amazon Checkout Result Return URL',
                pattern: '/amazon_pay/checkout/completeSession',
                path: 'extensions/@amzn/amazon-pay-pwa-studio-extension/src/controllers/complete'
            });

            return routesArray;
        }
    );

    checkoutPagePaymentTypes.tap(
        checkoutPagePaymentTypes => {
            checkoutPagePaymentTypes.add({
                paymentCode: 'amazon_payment_v2',
                importPath: 'extensions/@amzn/amazon-pay-pwa-studio-extension/src/components/CheckoutPage/PaymentInformation/paymentMethod.js'
            });

            return checkoutPagePaymentTypes;
        }
    );

    editablePaymentTypes.tap(
        editablePaymentTypes => {
            editablePaymentTypes.add({
                paymentCode: 'amazon_payment_v2',
                importPath:
                'extensions/@amzn/amazon-pay-pwa-studio-extension/src/components/CheckoutPage/PaymentInformation/edit.js'
            });

            return editablePaymentTypes;
        }
    );

    summaryPagePaymentTypes.tap(
        paymentSummaries => {
            paymentSummaries.add({
                paymentCode: 'amazon_payment_v2',
                importPath:
                    'extensions/@amzn/amazon-pay-pwa-studio-extension/src/components/CheckoutPage/PaymentInformation/summary.js'
            });

            return paymentSummaries;
        }
    );

    const targetableFactory = Targetables.using(targets);
    const PdpComponent = targetableFactory.module(
        '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js'
    );
    const MiniCartComponent = targetableFactory.module(
        '@magento/venia-ui/lib/components/MiniCart/miniCart.js'
    );
    const PriceSummaryComponent = targetableFactory.module(
        '@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.js'
    );
    const SignInComponent = targetableFactory.module(
        '@magento/venia-ui/lib/components/SignIn/signIn.js'
    );

    PdpComponent.insertAfterSource(
        './CustomAttributes\';',
        '\nimport AmazonButton from \'@amzn/amazon-pay-pwa-studio-extension/src/components/AmazonButton\';\n'
    );
    PdpComponent.insertAfterSource(
        '{cartActionContent}',
        '\n\t\t\t\t\t<AmazonButton productType={\'checkout\'}/>'
    );
    MiniCartComponent.insertAfterSource(
        './ProductList\';',
        '\nimport AmazonButton from \'@amzn/amazon-pay-pwa-studio-extension/src/components/AmazonButton\';\n'
    );
    MiniCartComponent.insertAfterSource(
        'defaultMessage={\'CHECKOUT\'}\n                    />\n                </Button>\n',
        '\t\t\t\t<AmazonButton productType={\'checkout\'}/>\n'
    );
    SignInComponent.insertAfterSource(
        'import GoogleRecaptcha from \'../GoogleReCaptcha\';',
        '\nimport AmazonButton from \'@amzn/amazon-pay-pwa-studio-extension/src/components/AmazonButton\';\n'
    );
    SignInComponent.insertAfterSource(
        'defaultMessage={\'Create an Account\'}\n                        />\n                    </Button>\n',
        '\t\t\t\t\t<AmazonButton productType={\'signin\'}/>\n'
    );

    const peregrineTargets = targets.of("@magento/peregrine");
    const talonsTarget = peregrineTargets.talons;

    talonsTarget.tap((talonWrapperConfig) => {
        talonWrapperConfig.CheckoutPage.useCheckoutPage.wrapWith(
            '@amzn/amazon-pay-pwa-studio-extension/src/talons/CheckoutPage/useCheckoutPage.js'
        );
        talonWrapperConfig.CheckoutPage.PaymentInformation.usePaymentMethods.wrapWith(
            '@amzn/amazon-pay-pwa-studio-extension/src/talons/CheckoutPage/PaymentInformation/usePaymentMethods.js'
        );
        talonWrapperConfig.CheckoutPage.ShippingInformation.useShippingInformation.wrapWith(
            '@amzn/amazon-pay-pwa-studio-extension/src/talons/CheckoutPage/ShippingInformation/useShippingInformationWrapper.js'
        );
        talonWrapperConfig.CheckoutPage.PaymentInformation.usePaymentInformation.wrapWith(
            '@amzn/amazon-pay-pwa-studio-extension/src/talons/CheckoutPage/PaymentInformation/usePaymentInformationWrapper.js'
        );
    });
};
