import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { sendPostRequest, sendStudentCourseListRequest } from 'Plugins/CommonUtils/SendPostRequest'
import { StudentGetCourseMessage } from 'Plugins/StudentAPI/StudentGetCourseMessage';
import { StudentAddCourseMessage } from 'Plugins/StudentAPI/StudentAddCourseMessage';
import { StudentDeleteCourseMessage } from 'Plugins/StudentAPI/StudentDeleteCourseMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { StudentCourse } from 'Plugins/CommonUtils/SendPostRequest';

export function StudentCourseDetail() {
    const history = useHistory();
    const { courseid } = useParams<{ courseid: string }>();
    const [errorMessage, setErrorMessage] = useState('');
    const [addCourseResponse, setAddCourseResponse] = useState('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState('');
    const [course, setCourse] = useState<StudentCourse | null>(null);

    useEffect(() => {
        getCourse();
    }, [courseid]);

    const getCourse = async () => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setErrorMessage('Invalid course ID');
            return;
        }

        const response = await sendStudentCourseListRequest(new StudentGetCourseMessage(id));
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }

        setCourse(response.data);
    };

    // Step 1: Define a type for the accumulator
    type Schedule = {
        [key: string]: Set<number>;
    };

    function formatCourseHours(courseHours: number[]): string {
        const weekMap = ['前八周', '后八周'];
        const dayMap = ['日', '一', '二', '三', '四', '五', '六'];
        const timeMap: { [key: string]: string } = {
            '0': '8:00~9:35',
            '1': '9:50~12:15',
            '2': '13:30~15:05',
            '3': '15:20~16:55',
            '4': '17:00~18:45',
            '5': '19:20~20:55',
        };

        // Step 2: Use the defined type in the reduce function
        const schedule = courseHours.reduce<Schedule>((acc, hour) => {
            const w = Math.floor(hour / 42);
            const d = Math.floor((hour - 42 * w) / 6);
            const h = hour - 42 * w - 6 * d;
            const key = `${d}-${h}`;

            if (!acc[key]) {
                acc[key] = new Set<number>();
            }
            acc[key].add(w);

            return acc;
        }, {});

        // Step 3: Explicitly declare the type of weeks
        return Object.entries(schedule).map(([key, weeks]) => {
            const [d, h] = key.split('-').map(Number);
            const weekStr = weeks.size === 2 ? '全周' : weekMap[[...weeks][0]];
            return `${weekStr} 星期${dayMap[d]} ${timeMap[h.toString()]}`;
        }).join('，');
    }

    const addCourse = async () => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setAddCourseResponse('Invalid course ID');
            return;
        }
        const response = await sendPostRequest(new StudentAddCourseMessage(id, 0));
        if (response.isError) {
            setAddCourseResponse(response.error);
            return;
        }
        setAddCourseResponse('Course added successfully');
    };

    const deleteCourse = async () => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setDeleteCourseResponse('Invalid course ID');
            return;
        }
        const response = await sendPostRequest(new StudentDeleteCourseMessage(id));
        if (response.isError) {
            setDeleteCourseResponse(response.error);
            return;
        }
        setDeleteCourseResponse('Course deleted successfully');
    };

    return (
        <StudentLayout>
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
                                    <td className="px-6 py-4 whitespace-nowrap">{course.courseid}</td>
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
                                    <td className="px-6 py-4 whitespace-nowrap">{formatCourseHours(course.courseHour)}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Classroom ID:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.classroomid}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enrolled Students Number:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.enrolledStudentsNumber}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">All Students Number:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.allStudentsNumber}</td>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student Status:</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.studentStatus}</td>
                                </tr>
                                </tbody>
                            </table>
                            {addCourseResponse && <p className="mt-4 text-green-500">{addCourseResponse}</p>}
                        </>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No course data available.</p>
                    )}
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={addCourse}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Register for Course
                    </button>
                    <button
                        onClick={deleteCourse}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Delete Course
                    </button>
                </div>
            </div>
        </StudentLayout>
    );
}
