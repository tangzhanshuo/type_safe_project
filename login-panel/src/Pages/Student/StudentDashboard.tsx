import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { StudentGetCourseByUsernameMessage } from 'Plugins/StudentAPI/StudentGetCourseByUsernameMessage';
import { StudentGetInfoMessage } from 'Plugins/StudentAPI/StudentGetInfoMessage';
import { StudentSetInfoMessage } from 'Plugins/StudentAPI/StudentSetInfoMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { FaSync } from 'react-icons/fa';

export function StudentDashboard() {
    const [studentUsername, setStudentUsername] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentAddress, setStudentAddress] = useState('');
    const [selectedCoursesCount, setSelectedCoursesCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        const username = Auth.getState().username;
        setStudentUsername(username);
        fetchStudentInfo();
        fetchSelectedCoursesCount(username);
    }, []);

    const fetchStudentInfo = async () => {
        const response = await sendPostRequest(new StudentGetInfoMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            setStudentName('');
            setStudentAddress('');
        } else {
            const info = response.data;
            setStudentName(info.name || '');
            setStudentAddress(info.address || '');
            setErrorMessage('');
        }
    };

    const fetchSelectedCoursesCount = async (username: string) => {
        const response = await sendPostRequest(new StudentGetCourseByUsernameMessage(username));
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
            name: studentName,
            address: studentAddress
        };
        const response = await sendPostRequest(new StudentSetInfoMessage(updatedInfo));
        if (response.isError) {
            setErrorMessage(response.error);
        } else {
            console.log('Student info saved successfully');
            setErrorMessage('');
            // Refresh the student info after saving
            await fetchStudentInfo();
        }
    }

    const handleRefresh = () => {
        fetchStudentInfo();
        fetchSelectedCoursesCount(studentUsername);
    }

    return (
        <StudentLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Welcome, {studentUsername}!</h2>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Student Information</h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                        Please review and update your personal information below. This information is used for official university communications and records.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                Enter your full legal name as it appears on official documents.
                            </p>
                            <input
                                id="name"
                                type="text"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                Provide your current mailing address. This will be used for any physical correspondence from the university.
                            </p>
                            <input
                                id="address"
                                type="text"
                                value={studentAddress}
                                onChange={(e) => setStudentAddress(e.target.value)}
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
                    <p>You have selected {selectedCoursesCount} course(s).</p>
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
        </StudentLayout>
    );
}