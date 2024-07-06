import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css';
import { sendUserRequest } from 'Plugins/CommonUtils/UserManager'
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { MessageTest } from 'Plugins/MessageAPI/MessageTest';

export function Main() {
    const history = useHistory();
    const [usertype, setUsertype] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [foundPassword, setFoundPassword] = useState('');

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
                    <button onClick={() => sendUserRequest("login", usertype, username, password)}
                            className="button">
                        Login
                    </button>
                    <button onClick={async () => {
                        const response = await sendPostRequest(new MessageTest())
                        console.log(response)
                    }}
                            className="button">
                        Test
                    </button>
                    <button onClick={() => history.push('/admin')} className="button">
                        Go to Admin
                    </button>
                    <button onClick={() => history.push('/admincourse')} className="button">
                        Go to AdminCourse
                    </button>
                </div>
            </main>
        </div>
    );
}
