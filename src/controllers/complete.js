import React, { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router';
import { useLazyQuery } from '@apollo/client';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import OrderConfirmationPage from '@magento/venia-ui/lib/components/CheckoutPage/OrderConfirmationPage';
import { useCompleteCheckoutSession } from '../talons/AmazonCheckoutSession/useCompleteCheckoutSession';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/checkoutPage.gql.js';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const CompleteController = props => {    
    const checkoutSessionId = useQuery().get('amazonCheckoutSessionId');
    const { getOrderDetailsQuery } = DEFAULT_OPERATIONS;
    
    const [
        getOrderDetails,
        { data: amazonOrderDetailsData, loading: amazonOrderDetailsLoading }
    ] = useLazyQuery(getOrderDetailsQuery, {
        fetchPolicy: 'no-cache'
    });

    const {
        loading: completeLoading,
        error: completeError,
        data: completeData,
        completeCheckoutSession
    } = useCompleteCheckoutSession();

    const [{cartId}] = useCartContext();

    useEffect(async () => {
        await getOrderDetails({
            variables: {
                cartId
            }
        });

        completeCheckoutSession({
            variables: {cartId: cartId, amazonSessionId: checkoutSessionId}
        });
    }, []);

    const controllerContent = (completeData && amazonOrderDetailsData) ? (
        <OrderConfirmationPage
            data={amazonOrderDetailsData}
            orderNumber={completeData.completeCheckoutSession.increment_id} />
        ) : (
        <LoadingIndicator />
        );

    const success = completeData?.completeCheckoutSession?.success;

    return completeError ? (
        <Redirect to="/cart"/>
    ): (
        <div>
            {controllerContent}
        </div>
    );
}

export default CompleteController;
