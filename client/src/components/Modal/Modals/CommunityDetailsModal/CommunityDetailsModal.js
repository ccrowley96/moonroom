import React, { useState, useRef, useEffect} from 'react';
import Modal from '../../Modal';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { activeCommunityVar } from '../../../../cache';
import { USER_QUERY } from '../../../../queries/profile';
import { DELETE_COMMUNITY } from '../../../../queries/community';
import { useHistory } from "react-router-dom";

import './CommunityDetailsModal.scss';

const CommunityDetailsModal = () => {

    const activeCommunity = useReactiveVar(activeCommunityVar)
    const { data } = useQuery(USER_QUERY);
    const [ deleteCommunity ] = useMutation(DELETE_COMMUNITY);
    const [ message, setMessage ] = useState('');
    const [ disableDelete, setDisableDelete] = useState(true);
    const [ areYouSureInput, setAreYouSureInput] = useState('');
    let history = useHistory();
    const timer = useRef(null);

    useEffect(() => {
        return () => clearTimeout(timer.current)
    },[])

    const handleDeleteCommunity = async () => {
        let result = await deleteCommunity({variables: {communityId: activeCommunity.id}})
        if(result.data.deleteCommunity.success){
            setMessage('Community deleted')
            timer.current = setTimeout(() => {
                history.go(0);
            }, 2000)
        } else{
            setMessage('Community could not be deleted')
        }
    }

    return(
        <Modal title={activeCommunity.name}>
            <div className="modalSection">
                <div className="sectionLabel">Community code</div>
                <div className="sectionValue">{activeCommunity.code}</div>
            </div>
            <div className="modalSection">
                <div className="sectionLabel">Members</div>
                {activeCommunity.members.map((member, idx) => {
                    return <div key={idx} className="sectionValue">{member.name}</div>
                })}
            </div>
            <div className="modalSection">
                <div className="sectionLabel">Admins</div>
                {activeCommunity.admins.map((admin, idx) => {
                    return <div key={idx} className="sectionValue">{admin.name}</div>
                })}
            </div>
            <div className="modalSection">
                <div className="sectionLabel">Created</div>
                <div className="sectionValue">{new Date(Number(activeCommunity.createdAt)).toDateString()}</div>
            </div>
            { data && data.me && activeCommunity.admins.find(admin => admin.id === data.me.id)&&
                 <div className="modalSection">
                    <div className="sectionLabel">Admin</div>
                    <div className="deleteContainer">
                        <div className="sectionValue _danger">Deleting <b>{activeCommunity.name}</b> will also delete all rooms and posts created within <b>{activeCommunity.name}</b>.  This cannot be undone.</div>
                        <input
                            placeholder='Enter community name to confirm'
                            value={areYouSureInput}
                            onChange={(e) => setAreYouSureInput(e.target.value)}
                        />
                        <button className="_btn-danger deleteBtn" onClick={ () => handleDeleteCommunity() } disabled={areYouSureInput !== activeCommunity.name}>
                            Delete community
                        </button>
                    </div>
                 </div>                    
            }
            <div className="_success">{message}</div>
        </Modal>
    )
}

export default CommunityDetailsModal;
