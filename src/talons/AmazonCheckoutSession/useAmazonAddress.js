import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from './details.gql'

export const useAmazonAddress = props => {
    const { getCheckoutSessionDetails } = DEFAULT_OPERATIONS;
    const [{ cartId }] = useCartContext();

    const { loading, data } = useQuery(getCheckoutSessionDetails, {
        variables: {amazonSessionId: props.amazonSessionId, queryTypes: [props.addressType]},
        fetchPolicy: 'network-only'
    });

    const [addressInput, setAddressInput] = useState(null);
    const [emailInput, setEmailInput] = useState(null);

    useEffect(() => {
        if (data) {
            const amazonAddress = JSON.parse(data.checkoutSessionDetails.response)[props.addressType][0];
            const quoteAddress = {
                "address": {
                    "city": amazonAddress.city,
                    "country_code": amazonAddress.country_id,
                    "firstname": amazonAddress.firstname,
                    "lastname": amazonAddress.lastname,
                    "postcode": amazonAddress.postcode,
                    "region": amazonAddress.region_code,
                    "street": amazonAddress.street.join(),
                    "telephone": amazonAddress.telephone
                }
            };

            const address = props.addressType === 'shipping' ?
                {
                    "cart_id": cartId,
                    "shipping_addresses": [
                        quoteAddress
                    ]
                } : {
                    "cartId": cartId,
                    "firstName": amazonAddress.firstname,
                    "lastName": amazonAddress.lastname,
                    "city": amazonAddress.city,
                    "postcode": amazonAddress.postcode,
                    "region": amazonAddress.region_code,
                    "country": amazonAddress.country_id,
                    "street1": amazonAddress.street[0],
                    "street2": amazonAddress.street[1],
                    "phoneNumber": amazonAddress.telephone
                };
            setAddressInput(address);

            if (props.addressType === 'shipping') {
                setEmailInput({
                    "cart_id": cartId,
                    "email": amazonAddress.email
                });
            }
        }
    }, [data]);

    return {
        loading,
        addressInput,
        emailInput
    };
};
