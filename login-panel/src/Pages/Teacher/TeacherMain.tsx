import React, {useContext, useEffect, useState} from 'react'
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import { logout } from 'Plugins/CommonUtils/UserManager'
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';
import { ThemeContext } from 'Plugins/CommonUtils/ThemeContext';
import 'Pages/css/Main.css';
import Auth from 'Plugins/CommonUtils/AuthState'

export function TeacherMain() {
    const history = useHistory();
    const { darkMode } = useContext(ThemeContext);

    useEffect(() => {
        // Assuming username and password are stored in localStorage
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            // Redirect to login page
            history.push('/login');
        }
        else if (usertype !== 'teacher') {
            history.push('/');
        }
    }, []);

    return (
        <TeacherLayout>
            <div className="p-6">
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Welcome to Teacher Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => history.push('/')}
                        className={`${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'} text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}
                    >
                        Back to Main
                    </button>
                    <button
                        onClick={() => logout(history)}
                        className={`${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}
                    >
                        Log out
                    </button>
                </div>
            </div>
        </TeacherLayout>
    );
}