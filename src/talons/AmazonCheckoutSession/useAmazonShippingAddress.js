import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from './details.gql'

export const useAmazonShippingAddress = props => {
    const { getCheckoutSessionDetails } = DEFAULT_OPERATIONS;
    const [{ cartId }] = useCartContext();

    const { loading, data } = useQuery(getCheckoutSessionDetails, {
        variables: {amazonSessionId: props.amazonSessionId, queryTypes: ['shipping']},
        fetchPolicy: 'network-only'
    });

    const [addressInput, setAddressInput] = useState(null);

    useEffect(() => {
        if (data) {
            const amazonAddress = JSON.parse(data.checkoutSessionDetails.response).shipping[0];
            const quoteAddress = {
                "address": {
                    "city": amazonAddress.city,
                    "country_code": amazonAddress.country_id,
                    "firstname": amazonAddress.firstname,
                    "lastname": amazonAddress.lastname,
                    "postcode": amazonAddress.postcode,
                    "region": amazonAddress.region_code,
                    "street": amazonAddress.street.join(', '),
                    "telephone": amazonAddress.telephone
                }
            };
            setAddressInput({
                "cart_id": cartId,
                "shipping_addresses": [
                    quoteAddress
                ]
            });
        }
    }, [data]);

    return {
        loading,
        addressInput
    };
};
