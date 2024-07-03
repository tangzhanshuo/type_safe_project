import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { UserLoginMessage } from 'Plugins/UserAPI/UserLoginMessage'
import { UserRegisterMessage } from 'Plugins/UserAPI/UserRegisterMessage'
import { useHistory } from 'react-router';

export function Main(){
    const history=useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const sendPostRequest = async (message: API) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
        } catch (error) {
            if (isAxiosError(error)) {
                // Check if the error has a response and a data property
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
            </main>
        </div>
    );
}


