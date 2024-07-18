import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { sendPostRequest, sendStudentCourseListRequest, StudentCourse } from 'Plugins/CommonUtils/SendPostRequest';
import { StudentGetAllCoursesByUsernameMessage } from 'Plugins/StudentAPI/StudentGetAllCoursesByUsernameMessage';
import { StudentDeleteCourseMessage } from 'Plugins/StudentAPI/StudentDeleteCourseMessage';
import Auth from 'Plugins/CommonUtils/AuthState';
import { logout } from 'Plugins/CommonUtils/UserManager';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { FaSync, FaTrash, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { CourseTable } from 'Components/CourseTable';

type SearchColumn = 'ID' | 'Name' | 'Teacher' | 'All';
type FilterStatus = 'Preregister' | 'Enrolled' | 'Waiting';

export function StudentMyCourse() {
    const [selectedCourses, setSelectedCourses] = useState<StudentCourse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState<string>('');
    const [showDeleteResponse, setShowDeleteResponse] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<keyof StudentCourse>('courseid');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchColumn, setSearchColumn] = useState<SearchColumn>('All');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('Enrolled');
    const history = useHistory();

    useEffect(() => {
        fetchSelectedCourses();
    }, []);

    const fetchSelectedCourses = async () => {
        const response = await sendStudentCourseListRequest(new StudentGetAllCoursesByUsernameMessage(Auth.getState().username));
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
        if (response.data) {
            setSelectedCourses(response.data);
        } else {
            setSelectedCourses([]);
        }
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

    const handleSort = (column: keyof StudentCourse) => {
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

    const filterCourses = (courses: StudentCourse[]) => {
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

    const filterByStatus = (courses: StudentCourse[]) => {
        switch (filterStatus) {
            case 'Preregister':
                return courses.filter(course => course.status === 'preregister');
            case 'Enrolled':
                return courses.filter(course =>
                    course.status !== 'preregister' && course.studentStatus === 'Enrolled'
                );
            case 'Waiting':
                return courses.filter(course =>
                    course.status !== 'preregister' && course.studentStatus === 'Waiting'
                );
            default:
                return courses;
        }
    };

    const filteredAndSortedCourses = filterByStatus(filterCourses(sortedCourses));

    const SortIcon = ({ column }: { column: keyof StudentCourse }) => {
        if (column !== sortColumn) return null;
        return sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
    };

   /* const MyCoursesPage = () => {
        const columns = ['Course ID', 'Course Name', 'Teacher', 'Capacity', 'Credits', 'Info', 'Options'];

        const renderCell = (course, column) => {
            switch (column) {
                case 'Course ID':
                    return <Link to={`/student/course/${course.courseid}`}
                                 className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">{course.courseid}</Link>;
                case 'Course Name':
                    return <span>{course.courseName}</span>;
                case 'Teacher':
                    return <span>{course.teacherName}</span>;
                case 'Capacity':
                    return <span>{course.capacity}</span>;
                case 'Credits':
                    return <span>{course.credits}</span>;
                case 'Info':
                    return <span>{course.info}</span>;
                case 'Options':
                    return (
                        <button onClick={() => deleteCourseWithId(course.courseid)}
                                className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                title="Delete course">
                            <FaTrash/>
                        </button>
                    );
                default:
                    return null;
            }
        };
    }*/

    const renderSortableHeader = (column: keyof StudentCourse, label: string) => (
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
                        <FaSync/>
                    </button>
                </div>

                <div className="flex space-x-4 mb-4">
                    {(['Preregister', 'Enrolled', 'Waiting'] as FilterStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded ${
                                filterStatus === status
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
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
                        <FaSearch
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"/>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    {filteredAndSortedCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <CourseTable
                                columns={['Course ID', 'Course Name', 'Teacher', 'Capacity', 'Credits', 'Info', 'Options']}
                                data={filteredAndSortedCourses}
                                renderCell={(item, column) => {
                                    switch (column) {
                                        case 'Course ID':
                                            return <Link to={`/student/course/${item.courseid}`}
                                                         className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">{item.courseid}</Link>;
                                        case 'Course Name':
                                            return <span>{item.courseName}</span>;
                                        case 'Teacher':
                                            return <span>{item.teacherName}</span>;
                                        case 'Capacity':
                                            return <span>{item.capacity}</span>;
                                        case 'Credits':
                                            return <span>{item.credits}</span>;
                                        case 'Info':
                                            return <span>{item.info}</span>;
                                        case 'Options':
                                            return (
                                                <button onClick={() => deleteCourseWithId(item.courseid)}
                                                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                        title="Delete course">
                                                    <FaTrash/>
                                                </button>
                                            );
                                        default:
                                            return null;
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No selected courses found matching your search
                            criteria.</p>
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
