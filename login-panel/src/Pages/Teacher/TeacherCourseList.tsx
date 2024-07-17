import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { sendPostRequest, sendCourseListRequest, Course } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherGetCourseListMessage } from 'Plugins/TeacherAPI/TeacherGetCourseListMessage';
import { TeacherDeleteCourseMessage } from 'Plugins/TeacherAPI/TeacherDeleteCourseMessage';
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';
import { FaSync, FaSort, FaSearch } from 'react-icons/fa';

type SortColumn = keyof Course;
type SortDirection = 'asc' | 'desc';
type SearchColumn = 'courseid' | 'courseName' | 'info' | 'All';

export function TeacherCourseList(): JSX.Element {
    const history = useHistory();
    const [courses, setCourses] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sortColumn, setSortColumn] = useState<SortColumn>('courseid');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchColumn, setSearchColumn] = useState<SearchColumn>('All');

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
        const response = await sendCourseListRequest(new TeacherGetCourseListMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            setIsLoading(false);
            return;
        }
        setCourses(response.data);
        setIsLoading(false);
    }

    const deleteCourse = async (courseid: number): Promise<void> => {
        const response = await sendPostRequest(new TeacherDeleteCourseMessage(courseid));
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }
        getCourses();
    }

    const handleSort = (column: SortColumn) => {
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
                case 'courseid':
                    return course.courseid.toString().includes(lowerSearchTerm);
                case 'courseName':
                    return course.courseName.toLowerCase().includes(lowerSearchTerm);
                case 'info':
                    return course.info.toLowerCase().includes(lowerSearchTerm);
                case 'All':
                    return (
                        course.courseid.toString().includes(lowerSearchTerm) ||
                        course.courseName.toLowerCase().includes(lowerSearchTerm) ||
                        course.info.toLowerCase().includes(lowerSearchTerm)
                    );
                default:
                    return true;
            }
        });
    };

    const filteredAndSortedCourses = filterCourses(sortedCourses);

    return (
        <TeacherLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Teacher Course List</h2>
                    <button
                        onClick={getCourses}
                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold p-2 rounded transition duration-300"
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
                        <option value="courseid">ID</option>
                        <option value="courseName">Name</option>
                        <option value="info">Info</option>
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

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 overflow-x-auto">
                    {errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : isLoading ? (
                        <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
                    ) : filteredAndSortedCourses.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {['courseid', 'courseName', 'capacity', 'credits', 'info', 'courseHour', 'classroomid', 'enrolledStudents'].map((column) => (
                                    <th
                                        key={column}
                                        onClick={() => handleSort(column as SortColumn)}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            {column}
                                            {sortColumn === column && <FaSort className="ml-1" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {filteredAndSortedCourses.map((course) => (
                                <tr key={course.courseid} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">{course.courseid}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.courseName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.capacity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.credits}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.info}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.courseHour.join(', ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.classroomid}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{course.enrolledStudents.length}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No courses available.</p>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}