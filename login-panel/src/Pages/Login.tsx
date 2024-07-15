import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { sendUserRequest } from 'Plugins/CommonUtils/UserManager';

interface LoginParams {
    usertype: 'student' | 'teacher' | 'admin';
}

export function Login() {
    const history = useHistory();
    const { usertype } = useParams<LoginParams>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        if (!['student', 'teacher', 'admin'].includes(usertype)) {
            history.push('/');
        }
    }, [usertype, history]);

    const handleLogin = async () => {
        try {
            const response = await sendUserRequest("login", usertype, username, password);
            if (response === 'Login successful') {
                setShowSuccessPopup(true);
            } else {
                setErrorMessage('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    const handleSuccessOk = () => {
        setShowSuccessPopup(false);
        history.push(`/${usertype}/dashboard`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        {usertype.charAt(0).toUpperCase() + usertype.slice(1)} Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {errorMessage && <p className="mt-2 text-center text-sm text-red-600">{errorMessage}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <button
                        onClick={() => history.push('/')}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Back to Home
                    </button>
                </div>
            </div>

            {showSuccessPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="my-modal">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white animate-popup">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Login Successful</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    You have successfully logged in.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    id="ok-btn"
                                    className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                                    onClick={handleSuccessOk}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}