import { useCallback } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useBillingInformation = props => {
    const [, { toggleDrawer }] = useAppContext();

    const handleEditBilling = useCallback(() => {
        toggleDrawer('billingInformation.edit');
    }, [toggleDrawer]);

    return {
        handleEditBilling
    };
};
