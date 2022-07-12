const { Targetables } = require("@magento/pwa-buildpack");

/**
 * Custom intercept file for the extension
 * By default you can only use target of @magento/pwa-buildpack.
 *
 * If do want extend @magento/peregrine or @magento/venia-ui
 * you should add them to peerDependencies to your package.json
 *
 * If you want to add overwrites for @magento/venia-ui components you can use
 * moduleOverrideWebpackPlugin and componentOverrideMapping
 */
module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        /**
         *  Wee need to activated esModules and cssModules to allow build pack to load our extension
         * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
         */
        flags[targets.name] = {esModules: true, cssModules: true};
    });

    // targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
    //     new NormalModuleOverridePlugin(componentOverrideMapping).apply(compiler);
    // });

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

    PdpComponent.insertAfterSource(
        './CustomAttributes\';',
        '\nimport AmazonButton from \'@amzn/amazon-pay-pwa-studio-extension/src/components/AmazonButton\';\n'
    );
    PdpComponent.insertAfterSource(
        '{cartActionContent}',
        '\n\t\t\t\t\t<AmazonButton/>'
    );
    MiniCartComponent.insertAfterSource(
        './ProductList\';',
        '\nimport AmazonButton from \'@amzn/amazon-pay-pwa-studio-extension/src/components/AmazonButton\';\n'
    );
    MiniCartComponent.insertAfterSource(
        'defaultMessage={\'CHECKOUT\'}\n                    />\n                </Button>\n',
        '\t\t\t\t<AmazonButton/>\n'
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
    });
};
