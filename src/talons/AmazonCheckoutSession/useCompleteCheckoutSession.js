import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from './complete.gql';

export const useCompleteCheckoutSession = props => {
    const { completeCheckoutSession } = DEFAULT_OPERATIONS;
    const [complete, {loading, error, data}] = useMutation(completeCheckoutSession);
    
    const [{cartId}] = useCartContext();
    const amazonSessionId = props.checkoutSessionId;

    complete({
        variables: {cartId: cartId, amazonSessionId: amazonSessionId}
    });

    const completeResponse = data ?
        data.completeCheckoutSession :
        null;

    return {
        loading,
        error,
        incrementId: completeResponse.increment_id,
        message: completeResponse.message,
        success: completeResponse.success
    };
};
