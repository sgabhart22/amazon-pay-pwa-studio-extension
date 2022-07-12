import { useMutation } from '@apollo/client';
import DEFAULT_OPERATIONS from './shippingInformation.gql';

export const useShippingInformation = props => {
    const { setShippingAddressesOnCart } = DEFAULT_OPERATIONS;
    const [setShippingAddress, {data, loading, error}] = useMutation(setShippingAddressesOnCart);

    return {
        setShippingLoading: loading,
        setShippingError: error,
        setShippingData: data,
        setShippingAddress  
    };
};
