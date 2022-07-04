import { useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from './paymentInformation.gql';

export const useAmazonPaymentMethod = props => {
    const { setAmazonPaymentMethodMutation } = DEFAULT_OPERATIONS;
    const { resetShouldSubmit, onPaymentSuccess, onPaymentError } = props;
    const [{cartId}] = useCartContext();
    
    const [
        setPaymentMethod, 
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setAmazonPaymentMethodMutation);

    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    const onBillingAddressChangedSuccess = useCallback(() => {
        setPaymentMethod({
            variables: { cartId }
        });
    }, [setPaymentMethod, cartId]);

    useEffect(() => {
        const paymentMethodMutationCompleted =
            paymentMethodMutationCalled && !paymentMethodMutationLoading;

        if (paymentMethodMutationCompleted && !paymentMethodMutationError) {
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError) {
            onPaymentError();
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit
    ]);

    return {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess   
    };
};
