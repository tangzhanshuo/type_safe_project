import React, { useEffect, useState } from 'react'
import axios, { isAxiosError, AxiosResponse, AxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css'; // Import the CSS file
import { sendUserRequest } from 'Plugins/CommonUtils/UserManager'
import Auth from 'Plugins/CommonUtils/AuthState'
import { AdminLayout } from 'Components/Admin/AdminLayout';

export function AdminUserManagement() {
        const history = useHistory();
        const [usertype, setUsertype] = useState('');
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [message, setMessage] = useState('');
        const [messageType, setMessageType] = useState('');

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

    const handleUserAction = async (
        action: string,
        usertype: string,
        username: string,
        password: string
    ) => {
        const response = await sendUserRequest(action, usertype, username, password);
        if (!response.isError) {
            setMessage(`${action} successful`);
            setMessageType('success');
        } else {
            setMessage(`Failed to ${action} user`);
            setMessageType('error');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Admin User Management</h2>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="input-group">
                        <select
                            value={usertype}
                            onChange={(e) => setUsertype(e.target.value)}
                            className="input-field dark:bg-gray-700 dark:text-white"
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
                            className="input-field dark:bg-gray-700 dark:text-white"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    {message && (
                        <p className={messageType === 'success' ? 'text-green-500' : 'text-red-500'}>{message}</p>
                    )}
                    <div className="button-group mt-4">
                        <button onClick={() => handleUserAction('register', usertype, username, password)}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                            Register
                        </button>
                        <button onClick={() => handleUserAction('delete', usertype, username, password)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ml-2">
                            Delete
                        </button>
                        <button onClick={() => handleUserAction('update', usertype, username, password)}
                                className="bg-yellow-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ml-2">
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
