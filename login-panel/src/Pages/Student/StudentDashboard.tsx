import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { StudentGetCourseByUsernameMessage } from 'Plugins/StudentAPI/StudentGetCourseByUsernameMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { FaSync } from 'react-icons/fa';

export function StudentDashboard() {
    const [studentUsername, setStudentUsername] = useState('');
    const [studentInfo, setStudentInfo] = useState('info');
    const [selectedCoursesCount, setSelectedCoursesCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        setStudentUsername(Auth.getState().username);
        fetchSelectedCoursesCount();
    }, []);

    const fetchSelectedCoursesCount = async () => {
        const response = await sendPostRequest(new StudentGetCourseByUsernameMessage(Auth.getState().username));
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
            const parsedCourses = JSON.parse(response.data);
            setSelectedCoursesCount(parsedCourses.length);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    }

    const handleSaveInfo = () => {
        console.log('Saving student info:', studentInfo);
        // Here you would typically send a request to update the info in the backend
    }

    return (
        <StudentLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Welcome, {studentUsername}!</h2>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Student Information</h3>
                    <input
                        type="text"
                        value={studentInfo}
                        onChange={(e) => setStudentInfo(e.target.value)}
                        className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
                            onClick={fetchSelectedCoursesCount}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded transition duration-300"
                            title="Refresh course information"
                        >
                            <FaSync />
                        </button>
                    </div>
                    <p>You have selected {selectedCoursesCount} course(s).</p>
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <div className="flex space-x-4">
                    <button
                        onClick={() => history.push('/student/dashboard')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Back to StudentMain
                    </button>
                    <button
                        onClick={() => logout(history)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </StudentLayout>
    );
}