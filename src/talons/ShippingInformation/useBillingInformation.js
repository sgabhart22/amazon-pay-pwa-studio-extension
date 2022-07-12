import { useMutation } from '@apollo/client';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/BillingAddress/billingAddress.gql';

export const useBillingAddress = props => {
    const { setBillingAddressMutation } = DEFAULT_OPERATIONS;
    const [setBillingAddress, {data, loading, error}] = useMutation(setBillingAddressMutation);

    return {
        setBillingAddress,
        setBillingLoading: loading,
        setBillingData: data,
        setBillingError: error
    }
};
