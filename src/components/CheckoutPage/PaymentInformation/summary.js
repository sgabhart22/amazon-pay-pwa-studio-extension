import React, { useState, useEffect } from 'react';
import { func, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Edit2 as EditIcon } from 'react-feather';

import { gql, useQuery } from '@apollo/client';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import AddressCard from '@magento/venia-ui/lib/components/CheckoutPage/AddressBook/addressCard';

import defaultClasses from './summary.module.css';
import { useAmazonPaymentDescriptor } from '../../../talons/AmazonCheckoutSession/useAmazonPaymentDescriptor';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

const Summary = props => {
    const { onEdit } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const checkoutSessionId = JSON.parse(localStorage.getItem('amazon-checkout-session')).id;
    const { paymentDescriptor } = useAmazonPaymentDescriptor({amazonSessionId: checkoutSessionId});

    const [{cartId}] = useCartContext();

    const formattedDescriptor = paymentDescriptor ?
        paymentDescriptor.payment.split('(')[0] : null;
    const displayMessageSuffix = formattedDescriptor ?
        ` (${formattedDescriptor})` : '';

    const [billingCardData, setBillingCardData] = useState(null);

    const { 
        loading: billingLoading,
        data: billingData,
        error: billingError 
    } = useQuery(GET_BILLING_ADDRESS, {
        variables: {cartId: cartId}
    });

    const billingAddressCardContent = billingCardData ? (
        <AddressCard
            address={billingCardData}
            isSelected={true}
            onSelection={() => {}}
            onEdit={() => {}} />
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
    }, [billingData]);

    return (
        <div className={classes.root}>
            <div className={classes.heading_container}>
                <h5 className={classes.heading}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformation'}
                        defaultMessage={'Payment Information'}
                    />
                </h5>
                <LinkButton
                    className={classes.edit_button}
                    onClick={onEdit}
                    type="button"
                >
                    <Icon
                        size={16}
                        src={EditIcon}
                        classes={{ icon: classes.edit_icon }}
                    />
                    <span className={classes.edit_text}>
                        <FormattedMessage
                            id={'global.editButton'}
                            defaultMessage={'Edit'}
                        />
                    </span>
                </LinkButton>
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
