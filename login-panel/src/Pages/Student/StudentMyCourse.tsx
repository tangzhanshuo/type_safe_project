import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { StudentGetCourseByUsernameMessage } from 'Plugins/StudentAPI/StudentGetCourseByUsernameMessage';
import { StudentDeleteCourseMessage } from 'Plugins/StudentAPI/StudentDeleteCourseMessage';
import Auth from 'Plugins/CommonUtils/AuthState';
import { logout } from 'Plugins/CommonUtils/UserManager';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { FaSync, FaTrash, FaSortUp, FaSortDown } from 'react-icons/fa';

interface Course {
    courseid: string;
    coursename: string;
    teachername: string;
    capacity: number;
    credits: number;
    info: string;
}

export function StudentMyCourse() {
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState<string>('');
    const [showDeleteResponse, setShowDeleteResponse] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<keyof Course>('courseid');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const history = useHistory();

    useEffect(() => {
        fetchSelectedCourses();
    }, []);

    const fetchSelectedCourses = async () => {
        const response = await sendPostRequest(new StudentGetCourseByUsernameMessage(Auth.getState().username));
        if (response.isError) {
            if (response.error.startsWith("No courses found")) {
                setErrorMessage('');
                setSelectedCourses([]);
            } else {
                setErrorMessage(response.error);
                setSelectedCourses([]);
            }
            return;
        }
        try {
            const parsedCourses: Course[] = JSON.parse(response.data);
            setSelectedCourses(parsedCourses);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    };

    const deleteCourseWithId = async (courseid: string) => {
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
        setDeleteCourseResponse('Course ' + id + ' deleted successfully');
        setShowDeleteResponse(true);
        setTimeout(() => setShowDeleteResponse(false), 2000);
        fetchSelectedCourses();
    };

    const handleSort = (column: keyof Course) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedCourses = [...selectedCourses].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ column }: { column: keyof Course }) => {
        if (column !== sortColumn) return null;
        return sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
    };

    const renderSortableHeader = (column: keyof Course, label: string) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort(column)}
        >
            <div className="flex items-center">
                {label}
                <SortIcon column={column} />
            </div>
        </th>
    );

    return (
        <StudentLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">My Courses</h2>
                    <button
                        onClick={fetchSelectedCourses}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded transition duration-300"
                        title="Refresh course list"
                    >
                        <FaSync />
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    {sortedCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {renderSortableHeader('courseid', 'Course ID')}
                                    {renderSortableHeader('coursename', 'Course Name')}
                                    {renderSortableHeader('teachername', 'Teacher')}
                                    {renderSortableHeader('capacity', 'Capacity')}
                                    {renderSortableHeader('credits', 'Credits')}
                                    {renderSortableHeader('info', 'Info')}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Options</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {sortedCourses.map((course) => (
                                    <tr key={course.courseid}>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.courseid}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.coursename}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.teachername}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.capacity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.credits}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.info}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => deleteCourseWithId(course.courseid)}
                                                className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                title="Delete course"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No selected courses.</p>
                    )}
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                {showDeleteResponse && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-lg">
                        {deleteCourseResponse}
                    </div>
                )}

                <div className="flex space-x-4">
                    <button
                        onClick={() => history.push('/student')}
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