import { gql, useMutation } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useCustomerEmail = props => {
    const [setGuestEmail, {data, loading, error}] = useMutation(
        SET_GUEST_EMAIL_ON_CART, {
            fetchPolicy: 'no-cache'
        });

    const [{ currentUser, isSignedIn }] = useUserContext();

    var userEmail = data;
    if (isSignedIn) {
        userEmail = currentUser.email;
    }

    return {
        customerEmailLoading: loading,
        customerEmailError: error,
        customerEmailData: userEmail,
        setGuestEmail
    };
};

export const SET_GUEST_EMAIL_ON_CART = gql`
    mutation setGuestEmailOnCart($input: SetGuestEmailOnCartInput) {
        setGuestEmailOnCart(input: $input) {
            cart {
                id
            }
        }
    }
`;
