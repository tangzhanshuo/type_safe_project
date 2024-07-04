import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { UserLoginMessage } from 'Plugins/UserAPI/UserLoginMessage';
import { UserRegisterMessage } from 'Plugins/UserAPI/UserRegisterMessage';
import { UserDeleteMessage } from 'Plugins/UserAPI/UserDeleteMessage';
import { UserUpdateMessage } from 'Plugins/UserAPI/UserUpdateMessage';
import { UserFindMessage } from 'Plugins/UserAPI/UserFindMessage';
import { useHistory } from 'react-router';

export function Main() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [foundPassword, setFoundPassword] = useState('');

    const sendPostRequest = async (message: API) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            if (message instanceof UserFindMessage) {
                const responseData = response.data;
                setFoundPassword(responseData.password || 'User not found');
            }
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response && error.response.data) {
                    console.error('Error sending request:', error.response.data);
                } else {
                    console.error('Error sending request:', error.message);
                }
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>HTTP Post Requests</h1>
            </header>
            <main>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={() => sendPostRequest(new UserLoginMessage(username, password))}>
                    Login
                </button>
                <button onClick={() => sendPostRequest(new UserRegisterMessage(username, password))}>
                    Register
                </button>
                <button onClick={() => sendPostRequest(new UserDeleteMessage(username, password))}>
                    Delete
                </button>
                <button onClick={() => sendPostRequest(new UserUpdateMessage(username, password))}>
                    Update
                </button>
                <button onClick={() => sendPostRequest(new UserFindMessage(username))}>
                    Find
                </button>
                {foundPassword && <p>Found Password: {foundPassword}</p>}
            </main>
        </div>
    );
}
