import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { API } from 'Plugins/CommonUtils/API';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherGetCourseMessage } from 'Plugins/TeacherAPI/TeacherGetCourseMessage';
import { TeacherDeleteCourseMessage } from 'Plugins/TeacherAPI/TeacherDeleteCourseMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';

interface Course {
    courseid: number;
    courseName: string;
    capacity: number;
    credits: number;
    info: string;
    courseHour: string;
    classroomid: number;
    enrolledStudents: string;
    teacherName: string;
}

export function TeacherCourseDetail() {
    const history = useHistory();
    const { courseid } = useParams<{ courseid: string }>();
    const [errorMessage, setErrorMessage] = useState('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState('');
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            history.push('/login');
        } else if (usertype !== 'teacher') {
            history.push('/');
        } else {
            getCourse();
        }
    }, [courseid, history]);

    const getCourse = async () => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setErrorMessage('Invalid course ID');
            return;
        }

        const response = await sendPostRequest(new TeacherGetCourseMessage(id));
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }
        try {
            const parsedCourse: Course = response.data;
            setCourse(parsedCourse);
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
        setIsLoading(false);
    }

    const deleteCourse = async () => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setDeleteCourseResponse('Invalid course ID');
            return;
        }
        const response = await sendPostRequest(new TeacherDeleteCourseMessage(id));
        if (response.isError) {
            setDeleteCourseResponse(response.error);
            return;
        }
        setDeleteCourseResponse('Course deleted successfully');
        setTimeout(() => history.push('/teacher/course'), 2000);
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Details</h1>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {errorMessage ? (
                        <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
                    ) : isLoading ? (
                        <p className="text-gray-600 dark:text-gray-400">Loading course details...</p>
                    ) : course ? (
                        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{course.courseName}</h2>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700">
                                <dl>
                                    {Object.entries(course).map(([key, value]) => (
                                        <div key={key} className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">{key}</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                            {deleteCourseResponse && <p className="mt-4 text-center text-green-600 dark:text-green-400">{deleteCourseResponse}</p>}
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No course data available.</p>
                    )}
                    <div className="mt-6 flex justify-center space-x-4">
                        <button onClick={() => history.push('/teacher/course')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            Back to Course List
                        </button>
                        <button onClick={() => history.push('/teacher/dashboard')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                            Back to TeacherMain
                        </button>
                        <button onClick={() => logout(history)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                            Log out
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}