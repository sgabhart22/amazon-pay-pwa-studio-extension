import { useMutation } from '@apollo/client';
import DEFAULT_OPERATIONS from './shippingInformation.gql';

export const useGuestEmail = props => {
    const { setGuestEmailOnCart } = DEFAULT_OPERATIONS;
    const [setGuestEmail, {data, loading, error}] = useMutation(
        setGuestEmailOnCart, {
            fetchPolicy: 'no-cache'
        });
    // const input = props.input;

    // setGuestEmail({
    //     variables: {input: input}
    // });
    
    // const cartId = data ?
    //     data.setGuestEmailOnCart.cart.id :
    //     null;

    return {
        guestEmailLoading: loading,
        guestEmailError: error,
        guestEmailData: data,
        setGuestEmail
    };
};

