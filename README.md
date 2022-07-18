# Sample Amazon Pay for Magento 2 Implementation for PWA Studio
This package is an example frontend integration of the Amazon Pay for Magento 2 Module in a PWA Studio setup. It is not intended to be a 'plug and play' solution for all headless Magento installations, but should provide a good starting point for setting up the Checkout Session API using either HTTP interface provided by the corresponding Magento module (GraphQL or REST).

## Adding an Amazon Pay Button
The @magento/venia-ui package now offers a method to alter standard PWA Studio components similar to the way the Magento backend offers Plugin classes to edit functionality of public methods. For an example, see how the  `intercept.js` adds the Amazon Pay button to the standard mini cart component. The following is a minimal snippet which adds the button after a given JSX element in a React component:

    const  { Targetables }  =  require("@magento/pwa-buildpack");
    module.exports  =  targets  =>  {
    ...
    const  targetableFactory  =  Targetables.using(targets);
    const  MiniCartComponent  =  targetableFactory.module(
	    '@magento/venia-ui/lib/components/MiniCart/miniCart.js'
    );
    
    MiniCartComponent.insertAfterSource(
	    './ProductList\';',
	    '\nimport AmazonButton from \'@amzn/amazon-pay-pwa-studio-extension/src/components/AmazonButton\';\n'
    );
    MiniCartComponent.insertAfterSource(
	    'defaultMessage={\'CHECKOUT\'}\n />\n </Button>\n',
	    '\t\t\t\t<AmazonButton productType={\'checkout\'}/>\n'
    );
It's worth noting that the tabs and newlines included are mostly superficial, but will make the final component file easier to read and debug if you need to inspect the source during debugging.

## Redirect URLs
In order to facilitate communication between Amazon and Magento , Amazon Pay depends on a few endpoints to review checkout, handle checkout results, and handle Amazon Sign In results, among others. These URLs are configurable and can be found in the Magento admin configuration under **Advanced > Developer Options** from the Amazon Pay settings.

For example, the *Amazon checkout review return URL* by default is `amazon_pay/login/checkout`. This is the URL where Amazon redirects customers after they authenticate with Amazon for a checkout session; with no other prefix, this will redirect the customer to `<your-magento-backend-base-url>/amazon_pay/login/checkout`. With a custom frontend, this needs to redirect to `<your-storefront-url>/<your-amazon-checkout-review-return-url>`. In the example intercept.js, a route is added to handle the checkout review:

```
const  { ... , routes }  =  targets.of('@magento/venia-ui');

routes.tap(routesArray  =>  {
	routesArray.push({
		name:  'Amazon Checkout Review Return URL',
		pattern:  '/amazon_pay/login/checkout',
		path:  '@amzn/amazon-pay-pwa-studio-extension/src/controllers/checkout'
	});

	return  routesArray;
});
```
Then, in `src/controllers/checkout.js`, the checkout session ID which is included as a query parameter in the redirect from Amazon can be used to request information such as shipping address, billing address, payment descriptor, and buyer email using the checkout session API of the Magento module.

## Including as a Local Dependency
If you'd like to experiment with the package in a development environment, you can add it to your local setup with the following steps:

 1. Clone this repository to a custom extension directory of your choosing (e.g., \<pwa-project-root>/extensions/@amzn/amazon-pay-pwa-studio-extension)
 2. Add the extension to the project's devDependencies in your root package.json, along with @babel/preset-react if it doesn't exist:
```
"devDependencies": {
	"@amzn/amazon-pay-pwa-studio-extension": "file:./extensions/@amzn/amazon-pay-pwa-studio-extension/"
	"@babel/preset-react": "~7.16.0"
	...
```
** Note: Because of the reliance on paths in`intercept.js`, declaring a custom module as a path dependency instead of using `yarn link` or `npm link` seems to work more smoothly.

3. To allow the module to apply transforms on the Venia components, add it to the trusted-vendors array of the pwa-studio object in your root package.json:
```
    "pwa-studio": {
        ... ,
        "trusted-vendors": [
            "@amzn"
        ]   
    }
```
4. Run `yarn install` or `npm install` followed by the `watch` script to launch a development server.

Alternately, if you'd like to make changes to the module in your custom extensions directory while still having file watchers in effect for hot reloads, you can create a symlink in `node_modules/@amzn` and point it to the directory where you cloned the package.
