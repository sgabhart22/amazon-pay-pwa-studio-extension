import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from './update.gql';

export const useUpdateCheckoutSession = props => {
    const { updateCheckoutSessionMutation } = DEFAULT_OPERATIONS;
    const [updateCheckoutSession, {loading, error, data}] = useMutation(updateCheckoutSessionMutation);
    
    // const [{cartId}] = useCartContext();
    // const amazonSessionId = props.checkoutSessionId;

    // update({
    //     variables: {cartId: cartId, amazonSessionId: amazonSessionId}
    // });

    // const redirectUrl = data ?
    //     data.updateCheckoutSession.redirectUrl :
    //     null;

    return {
        loading,
        error,
        data,
        updateCheckoutSession
    };
};
