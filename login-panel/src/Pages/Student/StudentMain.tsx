import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { logout } from 'Plugins/CommonUtils/UserManager';
import { ThemeContext } from 'Plugins/CommonUtils/ThemeContext';

export function StudentMain() {
    const history = useHistory();
    const { darkMode } = useContext(ThemeContext);

    return (
        <StudentLayout>
            <div className="p-6">
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Welcome to Student Dashboard</h2>
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
        </StudentLayout>
    );
}