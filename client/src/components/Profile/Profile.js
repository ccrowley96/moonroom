import { USER_QUERY } from '../../queries/profile';
import { useQuery } from '@apollo/client';
import './Profile.scss'

export default function Profile(){
    
    const { loading, error, data } = useQuery(USER_QUERY);

    console.log(data);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
        
    if(data.me){
        let { me } = data;
        let registeredDate = new Date(Number(me.registered));
        return(
            <div className="profileWrapper">
                <img style={{padding: "10px"}} alt="profile" src={me.picture} />
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
                    </tbody>
                    
                </table>
            </div>
        )
    } else{
        return null;
    }
}