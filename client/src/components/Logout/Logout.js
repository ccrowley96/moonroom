import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { GoogleLogout } from 'react-google-login';
import { useTheme } from '../../hooks/provideTheme';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./Logout.module.scss'));

export default function Logout() {
    const { theme } = useTheme();
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();

    const responseGoogle = async (googleResponse) => {
        // Set auth state
        auth.deauthenticateUser(() => history.replace('/login'));
    };

    if (auth.isUserAuthenticated() && location.pathname !== '/login') {
        return (
            <div className={cx('googleLogout')}>
                <GoogleLogout
                    theme={theme}
                    clientId="1064969668600-0j2jr5n6e2hppq6nki2qaal905sj2qea.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        );
    } else {
        return null;
    }
}
