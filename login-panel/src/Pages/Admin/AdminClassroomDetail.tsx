import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sendPostRequest, Classroom, Course } from 'Plugins/CommonUtils/SendPostRequest'
import { AdminGetClassroomMessage } from 'Plugins/AdminAPI/AdminGetClassroomMessage';
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { AdminGetCourseByCourseIDMessage } from 'Plugins/AdminAPI/AdminGetCourseByCourseIDMessage'
import { Link } from 'react-router-dom';

const timeSlots: string[] = [
    "8:00-9:35",
    "9:50-12:15",
    "13:30-15:05",
    "15:20-16:05",
    "19:20-20:55",
    "21:00-21:45"
];

interface WeekParts {
    [key: string]: { [key: number]: boolean };
}

interface CourseContent {
    courseName: string;
    teacherName: string;
}

export function AdminClassroomDetail() {
    const { classroomid } = useParams<{ classroomid: string }>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchClassroomCourses();
    }, [classroomid]);

    const fetchClassroomCourses = async () => {
        setIsLoading(true);
        try {
            const response = await sendPostRequest(new AdminGetClassroomMessage(parseInt(classroomid)));
            console.log('Response:', response.data.enrolledCourses)
            if (response.isError) {
                setErrorMessage(response.error);
                setCourses([]);
            } else {
                const coursesArray = [];
                for (const [courseid, coursetime] of Object.entries(response.data.enrolledCourses)) {
                    const cid = parseInt(courseid);
                    const courseResponse = await sendPostRequest(new AdminGetCourseByCourseIDMessage(cid));
                    if (!courseResponse.isError && courseResponse.data) {
                        coursesArray.push(courseResponse.data);
                    }
                }
                setCourses(coursesArray);
            }
        } catch (error) {
            setErrorMessage("教室课程数据加载失败，请重试。");
            setCourses([]);
        }
        setIsLoading(false);
    };

    const generateScheduleGrid = () => {
        const grid = Array.from({ length: 6 }, () => Array(7).fill(null));

        courses.forEach(course => {
            const courseHours = course.courseHour;
            const weekParts: WeekParts = courseHours.reduce((acc: WeekParts, hour: number) => {
                const weekPart = Math.floor(hour / 42);
                const weekDay = Math.floor((hour % 42) / 6);
                const dayPeriod = hour % 6;
                const key = `${weekDay}-${dayPeriod}`;
                if (!acc[key]) acc[key] = {};
                acc[key][weekPart] = true;
                return acc;
            }, {});

            const courseName = `${course.courseName}`;
            const teacherName = course.teacherName;

            const primaryContent = (
                <Link to={`/admin/course/${course.courseid}`} className="font-bold text-gray-900 hover:text-blue-500">
                    {teacherName}: {courseName}
                </Link>
            );

            for (const [key, value] of Object.entries(weekParts)) {
                const [weekDay, dayPeriod] = key.split('-').map(Number);
                const weekLabel = value[0] && value[1] ? "(全周)" : value[0] ? "(前八周)" : "(后八周)";
                const combinedContent = (
                    <div key={key}>
                        {primaryContent}{weekLabel}
                    </div>
                );

                if (!grid[dayPeriod][weekDay]) {
                    grid[dayPeriod][weekDay] = { content: [combinedContent] };
                } else {
                    grid[dayPeriod][weekDay].content.push(combinedContent);
                }
            }
        });

        return grid;
    };

    const scheduleGrid = generateScheduleGrid();

    return (
        <AdminLayout>
            <div className="w-full max-w-none space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Classroom Schedule</h2>
                    <button
                        onClick={fetchClassroomCourses}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded transition duration-300"
                        title="Refresh schedule"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 overflow-x-auto">
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs font-bold table-fixed">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-3 py-8 text-left text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time Slot</th>
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                <th key={day} className="px-3 py-8 text-left text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{day}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 text-xs">
                        {scheduleGrid.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="px-3 py-8 whitespace-nowrap">{timeSlots[rowIndex]}</td>
                                {row.map((cell, colIndex) => (
                                    <td key={colIndex} className={`px-3 py-8 whitespace-nowrap`}>
                                        {cell ? cell.content.map((item: React.ReactNode, index: number) => (
                                            <div key={index} className="whitespace-nowrap overflow-hidden overflow-ellipsis">{item}</div>
                                        )) : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
