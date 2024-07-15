import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { AdminLayout } from 'Components/Admin/AdminLayout';

export function AdminDashboard() {
    const [adminUsername, setAdminUsername] = useState('');
    const [adminInfo, setAdminInfo] = useState('info');
    const history = useHistory();

    useEffect(() => {
        setAdminUsername(Auth.getState().username);
    }, []);

    const handleSaveInfo = () => {
        console.log('Saving admin info:', adminInfo);
        // Here you would typically send a request to update the info in the backend
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Welcome, {adminUsername}!</h2>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Admin Information</h3>
                    <input
                        type="text"
                        value={adminInfo}
                        onChange={(e) => setAdminInfo(e.target.value)}
                        className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <button
                        onClick={handleSaveInfo}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Save Info
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
                    <p>Welcome to the Admin Dashboard. Here you can manage users, courses, classrooms, and applications.</p>
                </div>
            </div>
        </AdminLayout>
    );
}