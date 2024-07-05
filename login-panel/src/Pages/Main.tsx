import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { UserLoginMessage } from 'Plugins/UserAPI/UserLoginMessage';
import { useHistory } from 'react-router-dom';
import './css/Main.css'; // Import the CSS file

export function Main() {
    const history = useHistory();
    const [usertype, setUsertype] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const sendPostRequest = async (message: API) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            if (message instanceof UserLoginMessage) {
                const responseData = response.data as string;
                if (responseData === 'Valid user') {
                    history.push('/studentmain');
                } else {
                    setErrorMessage('Invalid username or password');
                }
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
                <h1>用户登录</h1>
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
                    <button onClick={() => sendPostRequest(new UserLoginMessage(usertype, username, password))}
                            className="button">
                        Login
                    </button>
                    <button onClick={() => history.push('/admin')} className="button">
                        Go to Admin
                    </button>

                </div>
            </main>
        </div>
    );
}
