import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { UserLoginMessage } from 'Plugins/UserAPI/UserLoginMessage';
import { UserRegisterMessage } from 'Plugins/UserAPI/UserRegisterMessage';
import { UserDeleteMessage } from 'Plugins/UserAPI/UserDeleteMessage';
import { UserUpdateMessage } from 'Plugins/UserAPI/UserUpdateMessage';
import { UserFindMessage } from 'Plugins/UserAPI/UserFindMessage';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/API/Utils';
import './css/Main.css'; // Import the CSS file

export function AdminJoke() {
    const history = useHistory();
    const [usertype, setUsertype] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [foundPassword, setFoundPassword] = useState('');

    const sendRequestWithCheck = async (messageType: string, usertype: string, username: string, password: string) => {
        if ( !(usertype == 'admin') ) {
            setErrorMessage('You should be a admin!');
            return;
        }
        setErrorMessage('');
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>警告</h1>
            </header>
            <main className="App-main">
                <p>您已解散所有老师和学生</p>
                <div className="button-group">
                    <button onClick={() => history.push('/')} className="button">
                        Log out
                    </button>
                </div>
            </main>
        </div>
    );
}