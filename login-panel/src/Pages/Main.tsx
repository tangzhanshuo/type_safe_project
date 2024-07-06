import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { UserLoginMessage } from 'Plugins/UserAPI/UserLoginMessage';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/API/Utils';
import 'Pages/css/Main.css';
import { UserRegisterMessage } from 'Plugins/UserAPI/UserRegisterMessage'
import { UserDeleteMessage } from 'Plugins/UserAPI/UserDeleteMessage'
import { UserUpdateMessage } from 'Plugins/UserAPI/UserUpdateMessage'
import { UserFindMessage } from 'Plugins/UserAPI/UserFindMessage'
import { UserJokeMessage } from 'Plugins/UserAPI/UserJokeMessage'

export function Main() {
    const history = useHistory();
    const [usertype, setUsertype] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [foundPassword, setFoundPassword] = useState('');
    const [jokeGet, setJokeGet] = useState('');

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
            case "joke":
                const JokeResponse = await sendPostRequest(new UserJokeMessage(usertype, username, password));
                switch (JokeResponse.data) {
                    case 'student':
                        history.push('/StudentJoke');
                        break;
                    case 'teacher':
                        history.push('/TeacherJoke');
                        break;
                    case 'admin':
                        history.push('/AdminJoke');
                        break;
                    default:
                        setErrorMessage('Unknown user type');
                }
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
                    <button onClick={() => sendRequestWithCheck("joke", usertype, username, password)}
                            className="button">
                        Joke
                    </button>
                    <button onClick={() => sendRequestWithCheck("login", usertype, username, password)}
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
