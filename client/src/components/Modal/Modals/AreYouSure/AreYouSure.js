import React, { useState, useRef, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { USER_QUERY } from '../../../../queries/profile';
import { useReactiveVar, useQuery } from '@apollo/client';
import { activeCommunityVar } from '../../../../cache';
import './AreYouSure.scss';

const AreYouSure = ({ mutation, dataKey, successMessage, failedMessage, buttonText, placeholder, confirmText, dangerText}) => {
    const activeCommunity = useReactiveVar(activeCommunityVar)
    const { data: userData } = useQuery(USER_QUERY);
    const [ areYouSureInput, setAreYouSureInput] = useState('');
    const [ message, setMessage ] = useState('');
    let history = useHistory();
    const timer = useRef(null);

    useEffect(() => {
        return () => clearTimeout(timer.current)
    },[])

    const handleConfirm = async () => {
        let result = await mutation()
        if(result.data[dataKey].success){
            setMessage(successMessage)
            timer.current = setTimeout(() => {
                history.go(0);
            }, 2000)
        } else{
            setMessage({failedMessage});
        }
    }

    if(userData && userData.me && activeCommunity.admins.find(admin => admin.id === userData.me.id)){
        return(
            <div className="modalSection">
                <div className="sectionLabel">Admin</div>
                <div className="deleteContainer">
                    <div className="sectionValue _danger">{dangerText}</div>
                    <input
                        placeholder={placeholder}
                        value={areYouSureInput}
                        onChange={(e) => setAreYouSureInput(e.target.value)}
                        className="confirmInput"
                    />
                    <button className="_btn-danger deleteBtn" onClick={ () => handleConfirm() } disabled={areYouSureInput !== confirmText}>
                        {buttonText}
                    </button>
                </div>
                <div className="_success successMessage">{message}</div>
            </div>    
        );
    } else{
        return null;
    }
}

export default AreYouSure;