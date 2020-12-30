import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { JOIN_COMMUNITY, CREATE_COMMUNITY } from '../../queries/community';
import './Communities.scss'

const Communities = () => {
    const [code, setCode] = useState('');
    const [communityName, setCommunityName] = useState('');
    const [errorState, setError] = useState(null);
    const [joinData, setJoinData] = useState(null);
    const [createData, setCreateData] = useState(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const history = useHistory();

    useEffect(() => {
        let timeout = null;
        
        if(shouldRedirect){
            timeout = setTimeout(() => {
                setJoinData(null);
                setCreateData(null);
                history.push('/')
            }, 2000)
        }
        return () => clearTimeout(timeout);
    })

    const [joinCommunity] = useMutation(JOIN_COMMUNITY);
    const [createCommunity] = useMutation(CREATE_COMMUNITY);

    const handleChangeCode = e => {
        setError(null);
        setCode(e.target.value);
    }

    const handleChangeCommunityName = e => {
        setError(null);
        setCommunityName(e.target.value);
    }

    const handleJoinCommunity = async () => {
        try{
            let community = await joinCommunity({ variables: { code: code } });
            setCode('');
            if(community.data.joinCommunity.success){
                setJoinData(community.data.joinCommunity)
                setShouldRedirect(true);
            } else{
                throw new Error(community.data.joinCommunity.message)
            }
        } catch(err){
            setError(err.message);
        }
    }

    const handleCreateCommunity = async () => {
        try{
            // Validate input
            if(communityName === ''){
                throw new Error('Community name cannot be empty');
            }
            let community = await createCommunity({ variables: { name: communityName } });
            setCommunityName('')
            if(community.data.addCommunity.success){
                setCreateData(community.data.addCommunity)
                setShouldRedirect(true);
            } else{
                throw new Error(community.data.addCommunity.message)
            }
        }catch(err){
            setError(err.message);
        }
    }

    const enterPressed = (e, targetFunc) => {
        let code = e.keyCode || e.which;
        if(code === 13) { 
            targetFunc()
        } 
    }

    return(
        <div className="homeContainer">
            <div className="section">
                <h3>Create a new community</h3>
                <input 
                    maxLength={16} 
                    value={communityName} 
                    onChange={(e) => handleChangeCommunityName(e)} 
                    placeholder='Enter name for your community'
                    onKeyPress={(e) => enterPressed(e, handleCreateCommunity)}
                />
                <button className="btn-primary joinCommunity" onClick={() => handleCreateCommunity()}>Create community</button>
            </div>
            <div className="section">
                <h3>Join a community</h3>
                <input 
                    maxLength={8} 
                    value={code} 
                    onChange={(e) => handleChangeCode(e)} 
                    placeholder='Enter community code'
                    onKeyPress={(e) => enterPressed(e, handleJoinCommunity)}
                />
                <button className="btn-primary joinCommunity" onClick={() => handleJoinCommunity()}>Join community</button>
            </div>
            <div className="info">
                { errorState &&
                    <div className='error'>{errorState}</div>
                }
                { joinData &&
                    <div className='success'>{joinData.message}</div>
                }
                { createData &&
                    <div className='success'>{createData.message}</div>
                }
            </div>
        </div>
    )
}

export default Communities;