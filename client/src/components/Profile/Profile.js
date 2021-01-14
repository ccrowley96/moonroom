import React from 'react';
import { USER_QUERY } from '../../queries/profile';
import { useQuery } from '@apollo/client';
import Logout from '../Logout/Logout';
import { useTheme } from '../../hooks/provideTheme';
import { useHistory } from 'react-router-dom';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./Profile.module.scss'));

export default function Profile() {
    const { loading, error, data } = useQuery(USER_QUERY);
    const { toggleTheme } = useTheme();
    const history = useHistory();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    if (data.me) {
        let { me } = data;
        let registeredDate = new Date(Number(me.registered));
        return (
            <div className={cx('profileWrapper')}>
                <button
                    className={cx('homeLink', '_btn')}
                    onClick={() => history.push('/home')}
                >
                    Home
                </button>
                <img
                    className={cx('profilePicture')}
                    style={{ padding: '10px' }}
                    alt="profile"
                    src={me.picture}
                />
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

                <div className={cx('profileBtn')}>
                    <button
                        className={cx('_btn')}
                        onClick={() => toggleTheme()}
                    >
                        Change theme
                    </button>
                </div>

                <div className={cx('profileBtn')}>
                    <Logout />
                </div>
            </div>
        );
    } else {
        return null;
    }
}
