import React from 'react';
import Modal from '../../Modal';
import { useReactiveVar, useMutation } from '@apollo/client';
import { activeCommunityVar } from '../../../../cache';
import { DELETE_COMMUNITY } from '../../../../queries/community';
import AreYouSure from '../AreYouSure/AreYouSure';
import './CommunityDetailsModal.scss';

const CommunityDetailsModal = () => {

    const activeCommunity = useReactiveVar(activeCommunityVar)
    const [ deleteCommunity ] = useMutation(DELETE_COMMUNITY);
    
    return(
        <Modal title={activeCommunity.name}>
            <div className="modalSection">
                <div className="sectionLabel">Community code</div>
                <div className="sectionValue">{activeCommunity.code}</div>
            </div>
            {
                activeCommunity.members.length > 0 &&
                <div className="modalSection">
                    <div className="sectionLabel">Members</div>
                    {activeCommunity.members.map((member, idx) => {
                        return <div key={idx} className="sectionValue">{member.name}</div>
                    })}
                </div>
            }
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
            
            <AreYouSure 
                mutation={() => deleteCommunity({variables: {communityId: activeCommunity.id}})}
                dataKey={'deleteCommunity'}
                successMessage={'Community deleted'}
                failedMessage={'Community could not be deleted'}
                buttonText={'Delete community'}
                placeholder={'Enter community name to confirm'}
                confirmText={activeCommunity.name}
                dangerText={<span>Deleting <b>{activeCommunity.name}</b> will also delete all rooms and posts created within <b>{activeCommunity.name}</b>.  This cannot be undone.</span>}
            />
        </Modal>
    )
}

export default CommunityDetailsModal;
