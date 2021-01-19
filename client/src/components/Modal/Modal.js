import React, { useEffect, useRef } from 'react';
import { useAppState } from '../../hooks/provideAppState';
import { actionTypes } from '../../constants/constants';
import { CgClose } from 'react-icons/cg';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./Modal.module.scss'));

const Modal = ({
    children,
    title,
    isConfirmOpen,
    setIsConfirmOpen,
    onConfirmed
}) => {
    const { appDispatch } = useAppState();

    const targetRef = useRef();

    // Prevent scroll while open
    useEffect(() => {
        if (targetRef.current) {
            disableBodyScroll(targetRef.current, { reserveScrollBarGap: true });
        }
        return () => clearAllBodyScrollLocks();
    }, []);

    const closeModal = () =>
        appDispatch({ type: actionTypes.SET_ACTIVE_MODAL, payload: null });

    return (
        <div className={cx('modalBlocker')} onClick={closeModal}>
            <div
                className={cx('modal')}
                onClick={(e) => e.stopPropagation()}
                ref={targetRef}
            >
                <div className={cx('modalTitle')}>{title}</div>
                <CgClose className={cx('closeX')} onClick={closeModal} />
                {children}
                {isConfirmOpen && (
                    <div className={cx('confirmDialogWrapper')}>
                        <div className={cx('confirmTitle')}>Are you sure?</div>
                        <div className={cx('confirmDialog')}>
                            <button
                                className={cx('_btn', 'dialogBtn')}
                                onClick={() => {
                                    setIsConfirmOpen(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={cx('_btn', 'dialogBtn', '_danger')}
                                onClick={() => {
                                    setIsConfirmOpen(false);
                                    onConfirmed();
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
