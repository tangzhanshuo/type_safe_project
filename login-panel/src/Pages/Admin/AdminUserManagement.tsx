import React, { useEffect, useState } from 'react'
import axios, { isAxiosError, AxiosResponse, AxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import { sendUserRequest } from 'Plugins/CommonUtils/UserManager'
import Auth from 'Plugins/CommonUtils/AuthState'
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { FaUserPlus, FaUserTimes, FaUserEdit } from 'react-icons/fa';


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
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="input-group flex flex-col space-y-4">
                        <select
                            value={usertype}
                            onChange={(e) => setUsertype(e.target.value)}
                            className="input-field dark:bg-gray-700 dark:text-white p-2 rounded-md border border-gray-400 focus:border-gray-500"
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
                            className="input-field dark:bg-gray-700 dark:text-white p-2 rounded-md border border-gray-400 focus:border-gray-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field dark:bg-gray-700 dark:text-white p-2 rounded-md border border-gray-400 focus:border-gray-500"
                        />
                    </div>
                    {message && (
                        <p className={messageType === 'success' ? 'text-green-500' : 'text-red-500'}>{message}</p>
                    )}
                    <div className="flex items-center space-x-4 p-4">
                        <button onClick={() => handleUserAction('register', usertype, username, password)}
                                className="bg-blue-400 hover:bg-blue-500 text-gray-100 font-semibold py-2 px-4 rounded-full shadow transition ease-in-out duration-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white flex items-center justify-center">
                            <FaUserPlus className="pr-2" size="24"/> <span>Create Account</span>
                        </button>
                        <button onClick={() => handleUserAction('delete', usertype, username, password)}
                                className="bg-red-400 hover:bg-red-500 text-gray-100 font-semibold py-2 px-4 rounded-full shadow transition ease-in-out duration-500 dark:bg-red-500 dark:hover:bg-red-600 dark:text-white flex items-center justify-center">
                            <FaUserTimes className="pr-2" size="24"/> <span>Remove User</span>
                        </button>
                        <button onClick={() => handleUserAction('update', usertype, username, password)}
                                className="bg-green-500 hover:bg-green-600 text-gray-100 font-semibold py-2 px-4 rounded-full shadow transition ease-in-out duration-500 dark:bg-green-600 dark:hover:bg-green-700 dark:text-white flex items-center justify-center">
                            <FaUserEdit className="pr-2" size="24"/> <span>Modify Details</span>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
