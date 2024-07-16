import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherGetCourseListMessage } from 'Plugins/TeacherAPI/TeacherGetCourseListMessage';
import { TeacherDeleteCourseMessage } from 'Plugins/TeacherAPI/TeacherDeleteCourseMessage';
import 'Pages/css/Main.css';
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';

interface Course {
    courseid: number;
    courseName: string;
    capacity: number;
    credits: number;
    info: string;
    courseHour: string;
    classroomid: number;
    enrolledStudents: string;
}

export function TeacherMyCourse(): JSX.Element {
    const history = useHistory();
    const [courses, setCourses] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            history.push('/login');
        } else if (usertype !== 'teacher') {
            history.push('/');
        } else {
            getCourses();
        }
    }, [history]);

    const getCourses = async (): Promise<void> => {
        setIsLoading(true);
        const response = await sendPostRequest(new TeacherGetCourseListMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            setIsLoading(false);
            return;
        }
        try {
            const parsedCourses: Course[] = response.data;
            setCourses(parsedCourses);
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
        setIsLoading(false);
    }

    const deleteCourse = async (courseid: number): Promise<void> => {
        const response = await sendPostRequest(new TeacherDeleteCourseMessage(courseid));
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }
        // Refresh the course list after successful deletion
        getCourses();
    }

    return (
        <TeacherLayout>
            <div className="App">
                <main className="App-main bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="course-list dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        {errorMessage ? (
                            <p style={{color: 'red'}}>{errorMessage}</p>
                        ) : isLoading ? (
                            <p>Loading courses...</p>
                        ) : courses.length > 0 ? (
                            <table className="min-w-full leading-normal">
                                <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                        Course ID
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                        Course Name
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                        Capacity
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                        Credits
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                        Info
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                        Course Hours
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                        Classroom ID
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                        Enrolled Students
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {courses.map(course => (
                                    <tr key={course.courseid} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            {course.courseid}

                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            {course.courseName}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            {course.capacity}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            {course.credits}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            {course.info}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            {course.courseHour}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            {course.classroomid}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            {course.enrolledStudents}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No courses available.</p>
                        )}

                        <div className="button-group">
                            <button onClick={getCourses}
                                    style={{marginTop: '30px'}}
                                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105">
                                Refresh Courses
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </TeacherLayout>
    );
}