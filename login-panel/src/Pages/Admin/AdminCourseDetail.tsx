import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminGetCourseByCourseIDMessage} from 'Plugins/AdminAPI/AdminGetCourseByCourseIDMessage'
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { AdminLayout } from 'Components/Admin/AdminLayout';

interface Course {
    courseID: string;
    courseName: string;
    teacherName: string;
    capacity: number;
    credits: number;
    info: string;
    courseHour: any; // Consider defining a more specific type
    classroomid: string;
    enrolledStudents: any; // Consider defining a more specific type
}

export function AdminCourseDetail() {
    const history = useHistory();
    const { courseID } = useParams<{ courseID: string }>();
    const [errorMessage, setErrorMessage] = useState('');
    const [updateCourseResponse, setUpdateCourseResponse] = useState('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState('');
    const [course, setCourse] = useState<Course | null>(null);

    useEffect(() => {
        getCourse();
    }, [courseID]);

    const getCourse = async () => {
        const id = parseInt(courseID, 10);
        if (isNaN(id)) {
            setErrorMessage('Invalid course ID');
            return;
        }

        const response = await sendPostRequest(new AdminGetCourseByCourseIDMessage(id));
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }

        const parsedCourse = {
            courseID: response.data.courseID,
            courseName: response.data.courseName,
            teacherName: response.data.teacherName,
            capacity: response.data.capacity,
            credits: response.data.credits,
            info: response.data.info,
            courseHour: response.data.courseHour,
            classroomid: response.data.classroomid,
            enrolledStudents: response.data.enrolledStudents
        };

        setCourse(parsedCourse);
    };

    const updateCourse = async () => {

    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Course Details</h2>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    {errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : course ? (
                        <>
                            <h3 className="text-xl font-semibold mb-4">{course.courseName}</h3>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course ID:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.courseID}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Teacher:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.teacherName}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Capacity:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.capacity}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credits:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.credits}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Info:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.info}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course Hours:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{JSON.stringify(course.courseHour)}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Classroom ID:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.classroomid}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enrolled Students:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{JSON.stringify(course.enrolledStudents)}</td>
                                </tr>
                                </tbody>
                            </table>
                            {updateCourseResponse && <p className="mt-4 text-green-500">{updateCourseResponse}</p>}
                        </>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No course data available.</p>
                    )}
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={updateCourse}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Update Course
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}