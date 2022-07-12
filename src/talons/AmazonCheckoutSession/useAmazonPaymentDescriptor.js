import { useQuery } from '@apollo/client';
import DEFAULT_OPERATIONS from './details.gql'

export const useAmazonPaymentDescriptor = props => {
    const { getCheckoutSessionDetails } = DEFAULT_OPERATIONS;

    const { loading, data } = useQuery(getCheckoutSessionDetails, {
        variables: {amazonSessionId: props.amazonSessionId, queryTypes: ['payment']},
        fetchPolicy: 'network-only'
    });

    return {
        paymentDescriptor:
            data
            && data.checkoutSessionDetails
            && JSON.parse(data.checkoutSessionDetails.response)
    };
};
