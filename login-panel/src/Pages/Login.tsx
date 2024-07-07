import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css';
import { sendUserRequest } from 'Plugins/CommonUtils/UserManager'
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';

export function Login() {
    const history = useHistory();
    const [usertype, setUsertype] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
                    <button onClick={async () => {
                        const response = await sendUserRequest("login", usertype, username, password)
                        if (response === 'Login successful') {
                            history.push('/' + usertype)
                        }
                    }}
                            className="button">
                        Login
                    </button>
                </div>
            </main>
        </div>
    );
}
