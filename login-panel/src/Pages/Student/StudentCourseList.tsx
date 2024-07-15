import React, { useEffect, useState } from 'react';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { useHistory, Link } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { StudentGetCourseListMessage } from 'Plugins/StudentAPI/StudentGetCourseListMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { StudentAddCourseMessage } from 'Plugins/StudentAPI/StudentAddCourseMessage';
import { StudentGetCourseByUsernameMessage } from 'Plugins/StudentAPI/StudentGetCourseByUsernameMessage';
import { FaSync, FaPlus, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';

interface Course {
    courseid: number;
    coursename: string;
    teachername: string;
    capacity: number;
    credits: number;
    info: string;
}

type SearchColumn = 'ID' | 'Name' | 'Teacher' | 'All';

export function StudentCourseList() {
    const [studentUsername, setStudentUsername] = useState<string>('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [addCourseResponse, setAddCourseResponse] = useState<string>('');
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [showAddResponse, setShowAddResponse] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<keyof Course>('courseid');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchColumn, setSearchColumn] = useState<SearchColumn>('All');
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

    const addCourseWithId = async (courseid: number) => {
        const response = await sendPostRequest(new StudentAddCourseMessage(courseid, 0));
        if (response.isError) {
            setAddCourseResponse(response.error);
            return;
        }
        setAddCourseResponse('Course ' + courseid + ' added successfully');
        setShowAddResponse(true);
        setTimeout(() => setShowAddResponse(false), 2000);
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

    const handleSort = (column: keyof Course) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedCourses = [...courses].sort((a, b) => {
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
                    return course.coursename.toLowerCase().includes(lowerSearchTerm);
                case 'Teacher':
                    return course.teachername.toLowerCase().includes(lowerSearchTerm);
                case 'All':
                    return (
                        course.courseid.toString().includes(lowerSearchTerm) ||
                        course.coursename.toLowerCase().includes(lowerSearchTerm) ||
                        course.teachername.toLowerCase().includes(lowerSearchTerm)
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
                    <h2 className="text-2xl font-bold">Course List</h2>
                    <button
                        onClick={getCourseList}
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
                    <h3 className="text-xl font-semibold mb-4">All Courses</h3>
                    {filteredAndSortedCourses.length > 0 ? (
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
                                {filteredAndSortedCourses.map((course) => (
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
                        <p className="text-gray-500 dark:text-gray-400">No courses found matching your search criteria.</p>
                    )}
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                {showAddResponse && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-lg">
                        {addCourseResponse}
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