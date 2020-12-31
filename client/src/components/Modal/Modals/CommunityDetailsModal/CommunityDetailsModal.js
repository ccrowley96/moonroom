import React from 'react';
import Modal from '../../Modal';
import { useReactiveVar, useQuery } from '@apollo/client';
import { activeCommunityVar } from '../../../../cache';
import { USER_QUERY } from '../../../../queries/profile';
import { DELETE_COMMUNITY } from '../../../../queries/community';

import './CommunityDetailsModal.scss';

const CommunityDetailsModal = () => {

    const activeCommunity = useReactiveVar(activeCommunityVar)
    const { data } = useQuery(USER_QUERY);

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
                    <button className="_btn-danger deleteBtn" onClick={() => null}>
                        Delete community
                    </button>
                 </div>                    
            }
        </Modal>
    )
}

export default CommunityDetailsModal;
