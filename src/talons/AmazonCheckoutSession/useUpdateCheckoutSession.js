import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from './update.gql';

export const useUpdateCheckoutSession = props => {
    const { updateCheckoutSession } = DEFAULT_OPERATIONS;
    const [update, {loading, error, data}] = useMutation(updateCheckoutSession);
    
    const [{cartId}] = useCartContext();
    const amazonSessionId = props.checkoutSessionId;

    update({
        variables: {cartId: cartId, amazonSessionId: amazonSessionId}
    });

    const redirectUrl = data ?
        data.updateCheckoutSession.redirectUrl :
        null;

    return {
        loading,
        error,
        redirectUrl
    };
};
