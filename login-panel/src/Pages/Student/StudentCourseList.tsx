import React, { useEffect, useState } from 'react';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { useHistory, Link } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { StudentGetCourseListMessage } from 'Plugins/StudentAPI/StudentGetCourseListMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { StudentAddCourseMessage } from 'Plugins/StudentAPI/StudentAddCourseMessage';
import { StudentDeleteCourseMessage } from 'Plugins/StudentAPI/StudentDeleteCourseMessage';
import { StudentGetCourseByUsernameMessage } from 'Plugins/StudentAPI/StudentGetCourseByUsernameMessage';
import { FaSync, FaTrash, FaPlus, FaSortUp, FaSortDown } from 'react-icons/fa';

interface Course {
    courseid: string;
    coursename: string;
    teachername: string;
    capacity: number;
    credits: number;
    info: string;
}

export function StudentCourseList() {
    const [studentUsername, setStudentUsername] = useState<string>('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [addCourseResponse, setAddCourseResponse] = useState<string>('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState<string>('');
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [showAddResponse, setShowAddResponse] = useState<boolean>(false);
    const [showDeleteResponse, setShowDeleteResponse] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<keyof Course>('courseid');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedSortColumn, setSelectedSortColumn] = useState<keyof Course>('courseid');
    const [selectedSortDirection, setSelectedSortDirection] = useState<'asc' | 'desc'>('asc');
    const history = useHistory();

    useEffect(() => {
        getCourseList();
        fetchSelectedCourses();
        setStudentUsername(Auth.getState().username);
    }, []);

    const fetchSelectedCourses = async () => {
        const response = await sendPostRequest(new StudentGetCourseByUsernameMessage(Auth.getState().username));
        if (response.isError) {
            if (!response.error.startsWith("No courses found")) {
                setErrorMessage(response.error);
            }
            setSelectedCourses([]);
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

    const addCourseWithId = async (courseid: string) => {
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
        setAddCourseResponse('Course ' + id + ' added successfully');
        setShowAddResponse(true);
        setTimeout(() => setShowAddResponse(false), 2000);
        fetchSelectedCourses();
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

    const getCourseList = async () => {
        const response = await sendPostRequest(new StudentGetCourseListMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }
        try {
            const parsedCourses: Course[] = JSON.parse(response.data);
            setCourses(parsedCourses);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    };

    const handleSort = (column: keyof Course, isSelectedCourses: boolean) => {
        if (isSelectedCourses) {
            if (column === selectedSortColumn) {
                setSelectedSortDirection(selectedSortDirection === 'asc' ? 'desc' : 'asc');
            } else {
                setSelectedSortColumn(column);
                setSelectedSortDirection('asc');
            }
        } else {
            if (column === sortColumn) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            } else {
                setSortColumn(column);
                setSortDirection('asc');
            }
        }
    };

    const sortedCourses = [...courses].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const sortedSelectedCourses = [...selectedCourses].sort((a, b) => {
        if (a[selectedSortColumn] < b[selectedSortColumn]) return selectedSortDirection === 'asc' ? -1 : 1;
        if (a[selectedSortColumn] > b[selectedSortColumn]) return selectedSortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ column, isSelectedCourses }: { column: keyof Course, isSelectedCourses: boolean }) => {
        const currentSortColumn = isSelectedCourses ? selectedSortColumn : sortColumn;
        const currentSortDirection = isSelectedCourses ? selectedSortDirection : sortDirection;
        if (column !== currentSortColumn) return null;
        return currentSortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
    };

    const renderSortableHeader = (column: keyof Course, label: string, isSelectedCourses: boolean) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort(column, isSelectedCourses)}
        >
            <div className="flex items-center">
                {label}
                <SortIcon column={column} isSelectedCourses={isSelectedCourses} />
            </div>
        </th>
    );

    return (
        <StudentLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Course List</h2>
                    <button
                        onClick={getCourseList}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded transition duration-300"
                        title="Refresh course list"
                    >
                        <FaSync />
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">All Courses</h3>
                    {sortedCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {renderSortableHeader('courseid', 'Course ID', false)}
                                    {renderSortableHeader('coursename', 'Course Name', false)}
                                    {renderSortableHeader('teachername', 'Teacher', false)}
                                    {renderSortableHeader('capacity', 'Capacity', false)}
                                    {renderSortableHeader('credits', 'Credits', false)}
                                    {renderSortableHeader('info', 'Info', false)}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Options</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {sortedCourses.map((course) => (
                                    <tr key={course.courseid}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/student/course/${course.courseid}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                {course.courseid}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.coursename}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.teachername}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.capacity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.credits}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.info}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {!selectedCourses.some(selectedCourse => selectedCourse.courseid === course.courseid) && (
                                                <button
                                                    onClick={() => addCourseWithId(course.courseid)}
                                                    className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                                                    title="Select course"
                                                >
                                                    <FaPlus />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No courses to display. Click the refresh button to load the course list.</p>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Selected Courses</h3>
                    {sortedSelectedCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {renderSortableHeader('courseid', 'Course ID', true)}
                                    {renderSortableHeader('coursename', 'Course Name', true)}
                                    {renderSortableHeader('teachername', 'Teacher', true)}
                                    {renderSortableHeader('capacity', 'Capacity', true)}
                                    {renderSortableHeader('credits', 'Credits', true)}
                                    {renderSortableHeader('info', 'Info', true)}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Options</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {sortedSelectedCourses.map((course) => (
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

                {showAddResponse && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-lg">
                        {addCourseResponse}
                    </div>
                )}

                {showDeleteResponse && (
                    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded shadow-lg">
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