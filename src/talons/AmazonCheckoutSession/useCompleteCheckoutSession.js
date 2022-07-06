import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from './complete.gql';

export const useCompleteCheckoutSession = props => {
    const { completeCheckoutSessionMutation } = DEFAULT_OPERATIONS;
    const [completeCheckoutSession, {loading, error, data}] = useMutation(completeCheckoutSessionMutation);
    
    // const [{cartId}] = useCartContext();
    // const amazonSessionId = props.checkoutSessionId;

    // complete({
    //     variables: {cartId: cartId, amazonSessionId: amazonSessionId}
    // });

    // const completeResponse = data ?
    //     data.completeCheckoutSession :
    //     null;

    return {
        loading,
        error,
        data,
        completeCheckoutSession
    };
};
