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
import 'Pages/css/Main.css'; // Import the CSS file

export function Admin() {
    const history = useHistory();
    const [usertype, setUsertype] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [foundPassword, setFoundPassword] = useState('');

    const sendRequestWithCheck = async (messageType: string, usertype: string, username: string, password: string) => {
        if (!usertype || !username) {
            setErrorMessage('Some required fields are missing');
            return;
        }
        if (!password && messageType !== 'find') {
            setErrorMessage('Password is required');
            return;
        }
        setErrorMessage('');
        switch (messageType) {
            case "login":
                await sendPostRequest(new UserLoginMessage(usertype, username, password));
                break;
            case "register":
                await sendPostRequest(new UserRegisterMessage(usertype, username, password));
                break;
            case "delete":
                await sendPostRequest(new UserDeleteMessage(usertype, username, password));
                break;
            case "update":
                await sendPostRequest(new UserUpdateMessage(usertype, username, password));
                break;
            case "find":
                const response = await sendPostRequest(new UserFindMessage(usertype, username));
                setFoundPassword(response.data.password);
                break;
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>大家都是Admin</h1>
            </header>
            <main className="App-main">
                <div className="input-group">
                    <select
                        value={usertype}
                        onChange={(e) => setUsertype(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Type</option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <div className="button-group">
                    <button onClick={() => sendRequestWithCheck("register", usertype, username, password)}
                            className="button">
                        Register
                    </button>
                    <button onClick={() => sendRequestWithCheck("delete", usertype, username, password)}
                            className="button">
                        Delete
                    </button>
                    <button onClick={() => sendRequestWithCheck("update", usertype, username, password)}
                            className="button">
                        Update
                    </button>
                    <button onClick={() => sendRequestWithCheck("find", usertype, username, password)}
                            className="button">
                        Find
                    </button>
                    <button onClick={() => history.push('/')} className="button">
                        Back to main
                    </button>
                </div>
                {foundPassword && <p className="result">Found Password: {foundPassword}</p>}
            </main>
        </div>
    );
}
