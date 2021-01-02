import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { enterPressed } from '../../services/utils';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./MutationInput.module.scss'));


const MutationInput = ({mutationType, cacheUpdate, dataTitle, dataKey, maxLength, placeholder, inputVariable, customVariables, refetchQueries, onSuccess}) => {
    const [text, setText] = useState('');
    const [errorState, setError] = useState(null);
    const [mutation] = useMutation(mutationType, {...(cacheUpdate && {update: cacheUpdate})});
    const [message, setMessage] = useState(null);
    const [shouldDisplayOnTimeout, setShouldDisplayOnTimeout] = useState(false);

    const handleTextChange = (e) => {
        setError(null);
        setText(e.target.value);
    }

    useEffect(() => {
        let timeout = null;
        if(shouldDisplayOnTimeout){
            timeout = setTimeout(() => {
                setMessage(null);
            }, 2000)
        }
        return () => clearTimeout(timeout);
    })

    const handleSubmit = async () => {
        try{
            // Validate input
            if(text === ''){
                throw new Error(`${dataTitle} cannot be empty`);
            }

            let inputVarObj = {[inputVariable]: text};

            let variableObj = customVariables ? Object.assign({}, inputVarObj, ...customVariables) : inputVarObj;

            let mutationOptions = {
                variables: variableObj,
                ...(refetchQueries && {refetchQueries})
            }

            let result = await mutation(mutationOptions);

            setText('')

            if(result.data[dataKey].success){
                setMessage(result.data[dataKey].message)
                setShouldDisplayOnTimeout(true)
                if(onSuccess)
                    onSuccess(result)
            } else{
                throw new Error(result.data[dataKey].message)
            }
        } catch(err){
            setError(err.message);
        }
    }

    return(
        <div className={cx('_modalSection')}>
            <div className={cx('_sectionLabel')}>
                {dataTitle}
            </div>
            <input 
                maxLength={maxLength} 
                value={text} 
                onChange={(e) => handleTextChange(e)} 
                placeholder={placeholder}
                onKeyPress={(e) => enterPressed(e, handleSubmit)}
                className={cx('_input')}
            />
            <button className={cx('_btn', 'submitButton')} onClick={() => handleSubmit()}>{dataTitle}</button>
            <div className={cx('info')}>
                { errorState &&
                    <div className={cx('error')}>{errorState}</div>
                }
                { message &&
                    <div className={cx('success')}>{message}</div>
                }
            </div>
        </div>
    )
}

export default MutationInput;