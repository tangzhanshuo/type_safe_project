import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { sendCourseListRequest, sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { Course } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminDeleteCourseMessage } from 'Plugins/AdminAPI/AdminDeleteCourseMessage';
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { FaSync, FaTrash, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { CourseTable } from 'Components/CourseTable';
import { AdminGetCourseListMessage } from 'Plugins/AdminAPI/AdminGetCourseListMessage'

type SearchColumn = 'ID' | 'Name' | 'Teacher' | 'Status' | 'All';

export function AdminCourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState<string>('');
    const [showDeleteResponse, setShowDeleteResponse] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<keyof Course>('courseid');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchColumn, setSearchColumn] = useState<SearchColumn>('All');
    const history = useHistory();

    useEffect(() => {
        getCourseList();
    }, []);

    const getCourseList = async () => {
        const response = await sendCourseListRequest(new AdminGetCourseListMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }
        try {
            setCourses(response.data);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    };

    const deleteCourseWithId = async (courseid: number) => {
        const response = await sendPostRequest(new AdminDeleteCourseMessage(courseid));
        if (response.isError) {
            setDeleteCourseResponse(response.error);
            return;
        }
        setDeleteCourseResponse('Course ' + courseid + ' deleted successfully');
        setShowDeleteResponse(true);
        setTimeout(() => setShowDeleteResponse(false), 2000);
        getCourseList();
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
        if (sortDirection === 'asc') {
            return a[sortColumn] < b[sortColumn] ? -1 : 1;
        } else {
            return a[sortColumn] > b[sortColumn] ? -1 : 1;
        }
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
                case 'Status':
                    return course.status.toLowerCase().includes(lowerSearchTerm);
                case 'All':
                    return (
                        course.courseid.toString().includes(lowerSearchTerm) ||
                        course.courseName.toLowerCase().includes(lowerSearchTerm) ||
                        course.teacherName.toLowerCase().includes(lowerSearchTerm) ||
                        course.status.toLowerCase().includes(lowerSearchTerm)
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
        <AdminLayout>
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
                        <option value="Status">Status</option>
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
                        <CourseTable
                            columns={[
                                'Course ID',
                                'Course Name',
                                'Teacher',
                                'Capacity',
                                'All Students Number',
                                'Enrolled Students Number',
                                'Credits',
                                'Info',
                                'Status',
                                'Options'
                            ]}
                            data={filteredAndSortedCourses}
                            renderCell={(item, column) => {
                                switch (column) {
                                    case 'Course ID':
                                        return <Link to={`/admin/course/${item.courseid}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">{item.courseid}</Link>;
                                    case 'Course Name':
                                        return <span>{item.courseName}</span>;
                                    case 'Teacher':
                                        return <span>{item.teacherName}</span>;
                                    case 'Capacity':
                                        return <span>{item.capacity}</span>;
                                    case 'All Students Number':
                                        return <span>{item.allStudents.length}</span>;
                                    case 'Enrolled Students Number':
                                        return <span>{item.enrolledStudents.length}</span>;
                                    case 'Credits':
                                        return <span>{item.credits}</span>;
                                    case 'Info':
                                        return <span>{item.info}</span>;
                                    case 'Status':
                                        return <span>{item.status}</span>;
                                    case 'Options':
                                        return (
                                            <button
                                                onClick={() => deleteCourseWithId(item.courseid)}
                                                className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                title="Delete course"
                                            >
                                                <FaTrash />
                                            </button>
                                        );
                                    default:
                                        return null;
                                }
                            }}
                        />
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No courses found matching your search criteria.</p>
                    )}
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                {showDeleteResponse && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-lg">
                        {deleteCourseResponse}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}