import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from './checkoutSession.gql';

export const useAmazonCheckout = props => {
    const { 
        getCheckoutSessionConfig,
        getCheckoutSessionDetails,
        updateCheckoutSessionMutation,
        completeCheckoutSessionMutation
     } = DEFAULT_OPERATIONS;
    
     const [{ cartId }] = useCartContext();
     const checkoutSessionId = props && props.amazonSessionId;

     const [amazonShippingAddress, setAmazonShippingAddress] = useState(null);
     const [amazonBillingAddress, setAmazonBillingAddress] = useState(null);
     const [amazonEmail, setAmazonEmail] = useState(null);

     const { 
        data: amazonConfigData,
        refetch: amazonConfigRefetch,
        networkStatus: amazonConfigNetworkStatus 
    } = useQuery(getCheckoutSessionConfig, {
         variables: {
             cartId: cartId
         },
         notifyOnNetworkStatusChange: true
     });
     const amazonConfig = amazonConfigData && amazonConfigData.checkoutSessionConfig;
    
     const { data: checkoutSessionDetailsData } = useQuery(getCheckoutSessionDetails, {
        variables: {
            amazonSessionId: checkoutSessionId,
            queryTypes: ['shipping', 'billing', 'payment']},
        fetchPolicy: 'network-only',
        skip: !checkoutSessionId
    });

    const amazonPaymentDescriptor = checkoutSessionDetailsData
        && checkoutSessionDetailsData.checkoutSessionDetails
        && JSON.parse(checkoutSessionDetailsData.checkoutSessionDetails.response).payment;

    const [
        updateCheckoutSession,
        {
            data: updateCheckoutSessionData,
            loading: updateCheckoutSessionLoading 
        }
    ] = useMutation(updateCheckoutSessionMutation);

    const [
        completeCheckoutSession,
        {
            error: completeCheckoutSessionError,
            data: completeCheckoutSessionData
        }
    ] = useMutation(completeCheckoutSessionMutation);

    useEffect(() => {
        if (checkoutSessionDetailsData) {
            const shippingAddress = JSON.parse(checkoutSessionDetailsData.checkoutSessionDetails.response).shipping[0];
            setAmazonShippingAddress({
                "cart_id": cartId,
                "shipping_addresses": [{
                    "address": {
                        "city": shippingAddress.city,
                        "country_code": shippingAddress.country_id,
                        "firstname": shippingAddress.firstname,
                        "lastname": shippingAddress.lastname,
                        "postcode": shippingAddress.postcode,
                        "region": shippingAddress.region_code,
                        "street": shippingAddress.street.join(),
                        "telephone": shippingAddress.telephone
                    }
                }]
            });

            setAmazonEmail({
                "cart_id": cartId,
                "email": shippingAddress.email
            });

            const billingAddress = JSON.parse(checkoutSessionDetailsData.checkoutSessionDetails.response).billing[0];
            setAmazonBillingAddress({
                "cartId": cartId,
                "firstName": billingAddress.firstname,
                "lastName": billingAddress.lastname,
                "city": billingAddress.city,
                "postcode": billingAddress.postcode,
                "region": billingAddress.region_code,
                "country": billingAddress.country_id,
                "street1": billingAddress.street[0],
                "street2": billingAddress.street[1],
                "phoneNumber": billingAddress.telephone
            });
        }
    }, [checkoutSessionDetailsData]);

    return {
        amazonConfig,
        amazonConfigRefetch,
        amazonConfigNetworkStatus,
        amazonShippingAddress,
        amazonBillingAddress,
        amazonEmail,
        amazonPaymentDescriptor,
        updateCheckoutSession,
        updateCheckoutSessionLoading,
        updateCheckoutSessionData,
        completeCheckoutSession,
        completeCheckoutSessionData,
        completeCheckoutSessionError
    };
};
