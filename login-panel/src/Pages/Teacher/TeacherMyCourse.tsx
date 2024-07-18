import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { sendCourseListRequest, sendPostRequest, Course } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherGetCourseListMessage } from 'Plugins/TeacherAPI/TeacherGetCourseListMessage';
import { TeacherEndPreRegisterMessage } from 'Plugins/TeacherAPI/TeacherEndPreRegisterMessage';
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';
import { FaSync, FaSort, FaSearch, FaStop } from 'react-icons/fa';
import { CourseTable } from 'Components/CourseTable';
type SortColumn = keyof Course;
type SortDirection = 'asc' | 'desc';
type SearchColumn = 'courseid' | 'courseName' | 'info' | 'All';

export function TeacherMyCourse(): JSX.Element {
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

    const handleEndPreRegister = async (courseId: number) => {
        const response = await sendPostRequest(new TeacherEndPreRegisterMessage(courseId));
        if (response.isError) {
            setErrorMessage(response.error);
        } else {
            getCourses(); // Refresh the course list
        }
    };

    return (
        <TeacherLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Courses</h2>
                    <button
                        onClick={getCourses}
                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold p-2 rounded transition duration-300"
                        title="Refresh courses"
                    >
                        <FaSync/>
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
                        <FaSearch
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"/>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 overflow-x-auto">
                    {errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : isLoading ? (
                        <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
                    ) : filteredAndSortedCourses.length > 0 ? (
                        <CourseTable
                            columns={['Course ID', 'Course Name', 'Capacity', 'Credits', 'Info', 'Course Hour', 'Classroom ID', 'Enrolled Students', 'Status', 'Action']}
                            data={filteredAndSortedCourses}
                            renderCell={(item, column) => {
                                switch (column) {
                                    case 'Course ID':
                                        return <span>{item.courseid}</span>;
                                    case 'Course Name':
                                        return <span>{item.courseName}</span>;
                                    case 'Capacity':
                                        return <span>{item.capacity}</span>;
                                    case 'Credits':
                                        return <span>{item.credits}</span>;
                                    case 'Info':
                                        return <span>{item.info}</span>;
                                    case 'Course Hour':
                                        return <span>{item.courseHour.join(', ')}</span>;
                                    case 'Classroom ID':
                                        return <span>{item.classroomid}</span>;
                                    case 'Enrolled Students':
                                        return <span>{item.enrolledStudents.length}</span>;
                                    case 'Status':
                                        return <span>{item.status}</span>;
                                    case 'Action':
                                        return item.status === 'preregister' ? (
                                            <button
                                                onClick={() => handleEndPreRegister(item.courseid)}
                                                className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                title="End Preregister"
                                            >
                                                <FaStop />
                                            </button>
                                        ) : null;
                                    default:
                                        return null;
                                }
                            }}
                        />
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No courses available.</p>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}