import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminGetCourseListMessage } from 'Plugins/AdminAPI/AdminGetCourseListMessage';
import { UserGetInfoMessage } from 'Plugins/UserAPI/UserGetInfoMessage';
import { UserSetInfoMessage } from 'Plugins/UserAPI/UserSetInfoMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { FaSync } from 'react-icons/fa';

export function AdminDashboard() {
    const [adminUsername, setAdminUsername] = useState('');
    const [adminInfo, setAdminInfo] = useState<any>(null);
    const [adminName, setAdminName] = useState('');
    const [adminDepartment, setAdminDepartment] = useState('');
    const [totalCoursesCount, setTotalCoursesCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        const username = Auth.getState().username;
        setAdminUsername(username);
        fetchAdminInfo();
        fetchTotalCoursesCount();
    }, []);

    const fetchAdminInfo = async () => {
        const response = await sendPostRequest(new UserGetInfoMessage("admin", Auth.getState().username));
        if (response.isError) {
            setErrorMessage(response.error);
            setAdminName('');
            setAdminDepartment('');
            setAdminInfo(null);
        } else {
            const info = response.data;
            setAdminInfo(info);
            setAdminName(info.name || '');
            setAdminDepartment(info.department || '');
            setErrorMessage('');
        }
    };

    const fetchTotalCoursesCount = async () => {
        const response = await sendPostRequest(new AdminGetCourseListMessage());
        if (response.isError) {
            if (response.error.startsWith("No courses found")) {
                setErrorMessage('');
                setTotalCoursesCount(0);
            } else {
                setErrorMessage(response.error);
                setTotalCoursesCount(0);
            }
            return;
        }
        try {
            const parsedCourses = response.data;
            setTotalCoursesCount(parsedCourses.length);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    }

    const handleSaveInfo = async () => {
        if (!adminInfo) {
            setErrorMessage('No admin information available');
            return;
        }

        const updatedInfo = {
            ...adminInfo,
            name: adminName,
            department: adminDepartment
        };
        const response = await sendPostRequest(new UserSetInfoMessage("admin", Auth.getState().username, updatedInfo));
        if (response.isError) {
            setErrorMessage(response.error);
        } else {
            console.log('Admin info saved successfully');
            setErrorMessage('');
            // Refresh the admin info after saving
            await fetchAdminInfo();
        }
    }

    const handleRefresh = () => {
        fetchAdminInfo();
        fetchTotalCoursesCount();
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Welcome, {adminUsername}!</h2>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Admin Information</h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                        Please review and update your professional information below. This information is used for official university records and communications.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                Enter your full name as it should appear in official documents.
                            </p>
                            <input
                                id="name"
                                type="text"
                                value={adminName}
                                onChange={(e) => setAdminName(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                Provide your current department. This information is used for administrative purposes.
                            </p>
                            <input
                                id="department"
                                type="text"
                                value={adminDepartment}
                                onChange={(e) => setAdminDepartment(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSaveInfo}
                        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Save Info
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">System Information</h3>
                        <button
                            onClick={handleRefresh}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded transition duration-300"
                            title="Refresh information"
                        >
                            <FaSync />
                        </button>
                    </div>
                    <p>Total courses in the system: {totalCoursesCount}</p>
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
        </AdminLayout>
    );
}