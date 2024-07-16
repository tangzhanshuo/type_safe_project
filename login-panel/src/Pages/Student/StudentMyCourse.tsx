import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { StudentGetCourseByUsernameMessage } from 'Plugins/StudentAPI/StudentGetCourseByUsernameMessage';
import { StudentDeleteCourseMessage } from 'Plugins/StudentAPI/StudentDeleteCourseMessage';
import Auth from 'Plugins/CommonUtils/AuthState';
import { logout } from 'Plugins/CommonUtils/UserManager';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { FaSync, FaTrash, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';

interface Course {
    courseid: number;
    courseName: string;
    teacherName: string;
    capacity: number;
    credits: number;
    info: string;
}

type SearchColumn = 'ID' | 'Name' | 'Teacher' | 'All';

export function StudentMyCourse() {
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState<string>('');
    const [showDeleteResponse, setShowDeleteResponse] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<keyof Course>('courseid');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchColumn, setSearchColumn] = useState<SearchColumn>('All');
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
        setSelectedCourses(response.data.map((course: any) => ({
            courseid: course.courseid,
            courseName: course.courseName,
            teacherName: course.teacherName,
            capacity: course.capacity,
            credits: course.credits,
            info: course.info,
        })));
    };

    const deleteCourseWithId = async (courseid: number) => {
        const response = await sendPostRequest(new StudentDeleteCourseMessage(courseid));
        if (response.isError) {
            setDeleteCourseResponse(response.error);
            return;
        }
        setDeleteCourseResponse('Course ' + courseid + ' deleted successfully');
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

    const filterCourses = (courses: Course[]) => {
        return courses.filter(course => {
            if (searchTerm === '') return true;
            const lowerSearchTerm = searchTerm.toLowerCase();
            switch (searchColumn) {
                case 'ID':
                    return course.courseid.toString().includes(lowerSearchTerm);
                case 'Name':
                    return course.courseName.toLowerCase().includes(lowerSearchTerm);
                case 'Teacher':
                    return course.teacherName.toLowerCase().includes(lowerSearchTerm);
                case 'All':
                    return (
                        course.courseid.toString().includes(lowerSearchTerm) ||
                        course.courseName.toLowerCase().includes(lowerSearchTerm) ||
                        course.teacherName.toLowerCase().includes(lowerSearchTerm)
                    );
                default:
                    return true;
            }
        });
    };

    const filteredAndSortedCourses = filterCourses(sortedCourses);

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

                <div className="flex items-center space-x-4 mb-4">
                    <select
                        value={searchColumn}
                        onChange={(e) => setSearchColumn(e.target.value as SearchColumn)}
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="All">All</option>
                        <option value="ID">ID</option>
                        <option value="Name">Name</option>
                        <option value="Teacher">Teacher</option>
                    </select>
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search courses..."
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    {filteredAndSortedCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {renderSortableHeader('courseid', 'Course ID')}
                                    {renderSortableHeader('courseName', 'Course Name')}
                                    {renderSortableHeader('teacherName', 'Teacher')}
                                    {renderSortableHeader('capacity', 'Capacity')}
                                    {renderSortableHeader('credits', 'Credits')}
                                    {renderSortableHeader('info', 'Info')}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Options</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {filteredAndSortedCourses.map((course) => (
                                    <tr key={course.courseid}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/student/course/${course.courseid}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                {course.courseid}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.courseName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{course.teacherName}</td>
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
                        <p className="text-gray-500 dark:text-gray-400">No selected courses found matching your search criteria.</p>
                    )}
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                {showDeleteResponse && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-lg">
                        {deleteCourseResponse}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
