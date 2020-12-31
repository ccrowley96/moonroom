import React from 'react';
import { useAppState } from '../../hooks/provideAppState';
import { actionTypes } from '../../constants/constants';
import { CgClose } from 'react-icons/cg';

import './Modal.scss'

const Modal = ({children, title}) => {
    const { appDispatch } = useAppState();

    const closeModal = () => appDispatch({type: actionTypes.SET_ACTIVE_MODAL, payload: null});

    return (
        <div className='modalBlocker' onClick={closeModal}>
            <div className='modal' onClick={(e) => e.stopPropagation()}>
                <div className='modalTitle'>{title}</div>
                <CgClose className='closeX' onClick={closeModal}/>
                {children}
            </div>
        </div>
    )
}

export default Modal;