import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { GoogleLogin } from 'react-google-login';
import { useTheme } from '../../hooks/provideTheme';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./Login.module.scss'));

export default function Login() {
    const { theme } = useTheme();

    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();

    let { from } = location.state || { from: { pathname: '/' } };

    const responseGoogle = async (googleResponse) => {
        console.log(googleResponse);
        let response = await fetch(`/auth/googleLogin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tokenId: googleResponse.tokenId })
        });

        if (response.status === 200) {
            let parsedResponse = await response.json();
            // Set auth state
            auth.authenticateUser(parsedResponse, () => history.push(from));
        } else {
            console.log('Google login failed');
        }
    };

    return (
        <div className={cx('jumboContainer')}>
            <div className={cx('jumbo')}>
                <h2 className={cx('jumboTitle')}>MoonRoom</h2>

                <div className={cx('googleLogin')}>
                    <GoogleLogin
                        theme={theme}
                        clientId="1064969668600-0j2jr5n6e2hppq6nki2qaal905sj2qea.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        prompt="select_account"
                        // isSignedIn={true} auto logs in user
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
                <div className={cx('jumboListWrapper')}>
                    <div className={cx('jumboList')}>
                        <div>Create a moon 🌕</div>
                        <div>Gather your astronauts 👨‍🚀</div>
                        <div>Start sharing &#128640;</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
