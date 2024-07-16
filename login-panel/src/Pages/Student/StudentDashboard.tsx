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
    const [studentInfo, setStudentInfo] = useState('');
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
            setStudentInfo('');
        } else {
            setStudentInfo(JSON.stringify(response.data));
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
        try {
            const parsedInfo = JSON.parse(studentInfo);
            const response = await sendPostRequest(new StudentSetInfoMessage(parsedInfo));
            if (response.isError) {
                setErrorMessage(response.error);
            } else {
                console.log('Student info saved successfully');
                setErrorMessage('');
                // Refresh the student info after saving
                await fetchStudentInfo();
            }
        } catch (error) {
            setErrorMessage('Error parsing student info. Please ensure it is valid JSON.');
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
                    <textarea
                        value={studentInfo}
                        onChange={(e) => setStudentInfo(e.target.value)}
                        className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        rows={5}
                    />
                    <button
                        onClick={handleSaveInfo}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
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