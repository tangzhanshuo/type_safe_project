import React, { useEffect, useState } from 'react'
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css'; // Import the CSS file
import { sendUserRequest } from 'Plugins/CommonUtils/UserManager'
import Auth from 'Plugins/CommonUtils/AuthState'

export function AdminMain() {
        const history = useHistory();
        const [usertype, setUsertype] = useState('');
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Assuming username and password are stored in localStorage
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            // Redirect to login page
            history.push('/login');
        }
        else if (usertype !== 'admin') {
            history.push('/');
        }
    }, []);

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
                    <button onClick={() => sendUserRequest('register', usertype, username, password)}
                            className="button">
                        Register
                    </button>
                    <button onClick={() => sendUserRequest('delete', usertype, username, password)}
                            className="button">
                        Delete
                    </button>
                    <button onClick={() => sendUserRequest('update', usertype, username, password)}
                            className="button">
                        Update
                    </button>
                </div>
            </main>
        </div>

    );
}
