import React from 'react';
import { USER_QUERY } from '../../queries/profile';
import { useQuery } from '@apollo/client';
import Logout from '../Logout/Logout';
import './Profile.scss'
import { useTheme } from '../../hooks/provideTheme';
import { useHistory } from 'react-router-dom';

export default function Profile(){
    
    const { loading, error, data } = useQuery(USER_QUERY);
    const {toggleTheme} = useTheme();
    const history = useHistory();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
        
    if(data.me){
        let { me } = data;
        let registeredDate = new Date(Number(me.registered));
        return(
            <div className="profileWrapper">
                <button className='homeLink _btn' onClick={() => history.push('/home')}>
                    Home
                </button>
                <img className="profilePicture" style={{padding: "10px"}} alt="profile" src={me.picture} />
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{me.name}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>{me.email}</td>
                        </tr>
                        <tr>
                            <td>ID</td>
                            <td>{me.id}</td>
                        </tr>
                        <tr>
                            <td>Registered</td>
                            <td>{registeredDate.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td> 
                                <button className="_btn" onClick={() => toggleTheme()}>Change theme</button>
                            </td>
                        </tr>
                        <tr>
                            <td> 
                                <Logout/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    } else{
        return null;
    }
}