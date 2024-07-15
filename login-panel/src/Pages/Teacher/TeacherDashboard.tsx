import React, {useContext, useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherGetCourseListMessage } from 'Plugins/TeacherAPI/TeacherGetCourseListMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';
import { FaSync } from 'react-icons/fa';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { ThemeContext } from 'Plugins/CommonUtils/ThemeContext';
import 'Pages/css/Main.css';

export function TeacherDashboard() {
    const [teacherUsername, setTeacherUsername] = useState('');
    const [teacherInfo, setTeacherInfo] = useState('info');
    const [selectedCoursesCount, setSelectedCoursesCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
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

    useEffect(() => {
        setTeacherUsername(Auth.getState().username);
        fetchSelectedCoursesCount();
    }, []);

    const fetchSelectedCoursesCount = async () => {
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
            const parsedCourses = JSON.parse(response.data);
            setSelectedCoursesCount(parsedCourses.length);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    }

    const handleSaveInfo = () => {
        console.log('Saving teacher info:', teacherInfo);
        // Here you would typically send a request to update the info in the backend
    }

    return (
        <TeacherLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Welcome, {teacherUsername}!</h2>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Teacher Information</h3>
                    <input
                        type="text"
                        value={teacherInfo}
                        onChange={(e) => setTeacherInfo(e.target.value)}
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

            </div>
        </TeacherLayout>
    );
}