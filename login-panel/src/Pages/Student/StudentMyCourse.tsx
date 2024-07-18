import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { StudentCourse, StudentWaitingPosition } from 'Plugins/CommonUtils/StudentUtils';
import { StudentDeleteCourseMessage } from 'Plugins/StudentAPI/StudentDeleteCourseMessage';
import Auth from 'Plugins/CommonUtils/AuthState';
import { logout } from 'Plugins/CommonUtils/UserManager';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { FaSync, FaTrash, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { StudentGetWaitingPositionMessage } from 'Plugins/StudentAPI/StudentGetWaitingPositionMessage';

type SearchColumn = 'ID' | 'Name' | 'Teacher' | 'All';
type FilterStatus = 'Preregister' | 'Enrolled' | 'Waiting';

export function StudentMyCourse() {
    const [waitingPositions, setWaitingPositions] = useState<StudentWaitingPosition[]>([]);
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
        const response = await sendPostRequest(new StudentGetWaitingPositionMessage());
        if (response.isError) {
            if (response.error.startsWith("No courses found")) {
                setErrorMessage('');
                setWaitingPositions([]);
            } else {
                setErrorMessage(response.error);
                setWaitingPositions([]);
            }
            return;
        }
        if (response.data) {
            setWaitingPositions(response.data);
        } else {
            setWaitingPositions([]);
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

    const sortedPositions = [...waitingPositions].sort((a, b) => {
        if (a.studentCourse[sortColumn] < b.studentCourse[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a.studentCourse[sortColumn] > b.studentCourse[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const filterPositions = (positions: StudentWaitingPosition[]) => {
        return positions.filter(position => {
            if (searchTerm === '') return true;
            const lowerSearchTerm = searchTerm.toLowerCase();
            switch (searchColumn) {
                case 'ID':
                    return position.studentCourse.courseid.toString().includes(lowerSearchTerm);
                case 'Name':
                    return position.studentCourse.courseName.toLowerCase().includes(lowerSearchTerm);
                case 'Teacher':
                    return position.studentCourse.teacherName.toLowerCase().includes(lowerSearchTerm);
                case 'All':
                    return (
                        position.studentCourse.courseid.toString().includes(lowerSearchTerm) ||
                        position.studentCourse.courseName.toLowerCase().includes(lowerSearchTerm) ||
                        position.studentCourse.teacherName.toLowerCase().includes(lowerSearchTerm)
                    );
                default:
                    return true;
            }
        });
    };

    const filterByStatus = (positions: StudentWaitingPosition[]) => {
        switch (filterStatus) {
            case 'Preregister':
                return positions.filter(position => position.studentCourse.status === 'preregister');
            case 'Enrolled':
                return positions.filter(position =>
                    position.studentCourse.status !== 'preregister' && position.studentCourse.studentStatus === 'Enrolled'
                );
            case 'Waiting':
                return positions.filter(position =>
                    position.studentCourse.status !== 'preregister' && position.studentCourse.studentStatus === 'Waiting'
                );
            default:
                return positions;
        }
    };

    const filteredAndSortedPositions = filterByStatus(filterPositions(sortedPositions));

    const SortIcon = ({ column }: { column: keyof StudentCourse }) => {
        if (column !== sortColumn) return null;
        return sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
    };

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
                        <FaSync />
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
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    {filteredAndSortedPositions.length > 0 ? (
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
                                    {filterStatus === 'Waiting' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Position
                                        </th>
                                    )}
                                    {filterStatus === 'Preregister' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Priority (Right is Highest)
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Options
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {filteredAndSortedPositions.map((position) => (
                                    <tr key={position.studentCourse.courseid}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/student/course/${position.studentCourse.courseid}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                {position.studentCourse.courseid}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{position.studentCourse.courseName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{position.studentCourse.teacherName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{position.studentCourse.capacity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{position.studentCourse.credits}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{position.studentCourse.info}</td>
                                        {filterStatus === 'Waiting' && (
                                            <td className="px-6 py-4 whitespace-nowrap">{position.position + 1}</td>
                                        )}
                                        {filterStatus === 'Preregister' && (
                                            <td className="px-6 py-4 whitespace-nowrap">{position.priority.join(', ')}</td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => deleteCourseWithId(position.studentCourse.courseid)}
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
