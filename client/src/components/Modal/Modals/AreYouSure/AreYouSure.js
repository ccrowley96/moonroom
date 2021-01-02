import React, { useState, useRef, useEffect} from 'react';
import { USER_QUERY } from '../../../../queries/profile';
import { useQuery } from '@apollo/client';
import './AreYouSure.scss';

const AreYouSure = ({ mutation, buttonText, placeholder, confirmText, dangerText, activeCommunity}) => {
    const { data: userData } = useQuery(USER_QUERY);
    const [ areYouSureInput, setAreYouSureInput] = useState('');

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
                    <button className="_btn-danger deleteBtn" onClick={mutation} disabled={areYouSureInput !== confirmText}>
                        {buttonText}
                    </button>
                </div>
            </div>    
        );
    } else{
        return null;
    }
}

export default AreYouSure;