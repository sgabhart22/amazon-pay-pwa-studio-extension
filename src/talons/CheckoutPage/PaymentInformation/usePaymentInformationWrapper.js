import { useCallback } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const wrapUsePaymentInformation = original => {
    return function usePaymentInformation(props) {
        const {
            showEditModal,
            hideEditModal,
            setIsEditModalActive,
            ...defaults
        } = original(props);

        const [, { toggleDrawer, closeDrawer }] = useAppContext();
        const isAmazonCheckout = JSON.parse(localStorage.getItem('amazon-checkout-session'))?.id;

        var myShowEditModal = showEditModal,
            myHideEditModal = hideEditModal;

        if (isAmazonCheckout) {
            myShowEditModal = useCallback(() => {
                setIsEditModalActive(true);
                toggleDrawer('paymentInformation.edit');
            }, []);

            myHideEditModal = useCallback(() => {
                setIsEditModalActive(false);
                closeDrawer();
            }, []);
        }

        return {
            showEditModal: myShowEditModal,
            hideEditModal: myHideEditModal,
            ...defaults
        };
    };
};

export default wrapUsePaymentInformation;