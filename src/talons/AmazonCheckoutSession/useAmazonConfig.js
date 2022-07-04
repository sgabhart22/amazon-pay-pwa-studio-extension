import { useQuery } from '@apollo/client';
import DEFAULT_OPERATIONS from './config.gql';

export const useAmazonConfig = props => {
    const { getCheckoutSessionConfig } = DEFAULT_OPERATIONS;
    const { loading, error, data } = useQuery(getCheckoutSessionConfig);
    
    const amazonConfig = data ?
        data.checkoutSessionConfig :
        {};

    return {
        loading,
        error,
        amazonConfig    
    };
};
