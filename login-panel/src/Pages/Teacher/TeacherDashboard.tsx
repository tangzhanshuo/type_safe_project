import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherGetCourseListMessage } from 'Plugins/TeacherAPI/TeacherGetCourseListMessage';
import { UserGetInfoMessage } from 'Plugins/UserAPI/UserGetInfoMessage';
import { UserSetInfoMessage } from 'Plugins/UserAPI/UserSetInfoMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';
import { FaSync } from 'react-icons/fa';

export function TeacherDashboard() {
    const [teacherUsername, setTeacherUsername] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [teacherDepartment, setTeacherDepartment] = useState('');
    const [selectedCoursesCount, setSelectedCoursesCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        const username = Auth.getState().username;
        setTeacherUsername(username);
        fetchTeacherInfo();
        fetchSelectedCoursesCount(username);
    }, []);

    const fetchTeacherInfo = async () => {
        const response = await sendPostRequest(new UserGetInfoMessage("teacher", teacherUsername));
        if (response.isError) {
            setErrorMessage(response.error);
            setTeacherName('');
            setTeacherDepartment('');
        } else {
            const info = response.data;
            setTeacherName(info.name || '');
            setTeacherDepartment(info.department || '');
            setErrorMessage('');
        }
    };

    const fetchSelectedCoursesCount = async (username: string) => {
        const response = await sendPostRequest(new TeacherGetCourseListMessage());
        if (response.isError) {
            if (response.error.startsWith("No courses found")) {
                setErrorMessage('');
                setSelectedCoursesCount(0);
            } else {
                setErrorMessage(response.error);
                setSelectedCoursesCount(0);
            }
            return;
        }
        try {
            const parsedCourses = response.data;
            setSelectedCoursesCount(parsedCourses.length);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    }

    const handleSaveInfo = async () => {
        const updatedInfo = {
            name: teacherName,
            department: teacherDepartment
        };
        const response = await sendPostRequest(new UserSetInfoMessage("teacher", teacherUsername, updatedInfo));
        if (response.isError) {
            setErrorMessage(response.error);
        } else {
            console.log('Teacher info saved successfully');
            setErrorMessage('');
            // Refresh the teacher info after saving
            await fetchTeacherInfo();
        }
    }

    const handleRefresh = () => {
        fetchTeacherInfo();
        fetchSelectedCoursesCount(teacherUsername);
    }

    return (
        <TeacherLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Welcome, {teacherUsername}!</h2>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Teacher Information</h3>
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
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
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
                                value={teacherDepartment}
                                onChange={(e) => setTeacherDepartment(e.target.value)}
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
                        <h3 className="text-xl font-semibold">Course Information</h3>
                        <button
                            onClick={handleRefresh}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded transition duration-300"
                            title="Refresh information"
                        >
                            <FaSync />
                        </button>
                    </div>
                    <p>You are teaching {selectedCoursesCount} course(s).</p>
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
        </TeacherLayout>
    );
}