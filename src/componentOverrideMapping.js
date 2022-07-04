/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {    
    [`@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.js`]: '@amzn/amazon-pay-pwa-studio-extension/src/components/CartPage/PriceSummary/index.js',
    [`@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods.js`]: '@amzn/amazon-pay-pwa-studio-extension/src/talons/CheckoutPage/PaymentInformation/usePaymentMethods.js'
};
