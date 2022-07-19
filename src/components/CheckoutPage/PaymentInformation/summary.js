import React, { useState, useEffect } from 'react';
import { func, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { gql, useQuery } from '@apollo/client';

import { useStyle } from '@magento/venia-ui/lib/classify';
import AddressCard from '@magento/venia-ui/lib/components/CheckoutPage/AddressBook/addressCard';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import { useAmazonCheckout } from '../../../talons/AmazonCheckoutSession/useAmazonCheckout';
import defaultClasses from './summary.module.css';

const Summary = props => {
    const { onEdit } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session')).id;
    const { amazonPaymentDescriptor } = useAmazonCheckout({amazonSessionId: checkoutSessionId});

    const [{cartId}] = useCartContext();
    const [{drawer},] = useAppContext();

    const formattedDescriptor = amazonPaymentDescriptor ?
        amazonPaymentDescriptor.split('(')[0] : null;
    const displayMessageSuffix = formattedDescriptor ?
        ` (${formattedDescriptor})` : '';

    const [billingCardData, setBillingCardData] = useState(null);
    const [billingUpdated, setBillingUpdated] = useState(false);

    const { 
        loading: billingLoading,
        data: billingData,
        error: billingError,
        refetch
    } = useQuery(GET_BILLING_ADDRESS, {
        variables: {cartId: cartId}
    });

    const editBilling = () => {
        onEdit();
        setBillingUpdated(true);
    }

    const billingAddressCardContent = billingCardData ? (
        <AddressCard
            address={billingCardData}
            isSelected={true}
            onSelection={() => {}}
            onEdit={editBilling} />    
    ) : null;

    useEffect(() => {
        if (billingData && !billingCardData) {
            const rawAddress = billingData.cart.billingAddress;
            const addressData = {
                firstname: rawAddress.firstName,
                lastname: rawAddress.lastName,
                city: rawAddress.city,
                country_code: rawAddress.country.code,
                default_shipping: false,
                postcode: rawAddress.postcode,
                region: {
                    region_code: rawAddress.region.code,
                    region: rawAddress.region.label
                },
                street: rawAddress.street
            };
            
            setBillingCardData(addressData);
        }
    }, [billingData, billingUpdated]);

    useEffect(() => {
        if (!drawer && billingUpdated) {
            setBillingUpdated(false);
            setBillingCardData(null);
            refetch({
                variables: {cartId: cartId}
            });
        }
    }, [drawer, billingUpdated])

    return (
        <div className={classes.root}>
            <div className={classes.heading_container}>
                <h5 className={classes.heading}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformation'}
                        defaultMessage={'Payment Information'}
                    />
                </h5>
            </div>
            <div className={classes.amazon_pay_details_container}>
                <span>
                    <FormattedMessage
                        id={'amazonPay.paymentType'}
                        defaultMessage={'Amazon Pay' + displayMessageSuffix}
                    />
                    {billingAddressCardContent}
                </span>
            </div>
        </div>
    );
};

export const GET_BILLING_ADDRESS = gql`
    query getBillingAddress($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            billingAddress: billing_address {
                firstName: firstname
                lastName: lastname
                country {
                    code
                }
                street
                city
                region {
                    code
                    label
                }
                postcode
                phoneNumber: telephone
            }
        }
    }
`;

export default Summary;

Summary.propTypes = {
    classes: shape({
        root: string,
        amazon_pay_details_container: string,
        edit_button: string,
        edit_icon: string,
        edit_text: string,
        heading_container: string,
        heading: string,
        payment_type: string
    }),
    onEdit: func
};
