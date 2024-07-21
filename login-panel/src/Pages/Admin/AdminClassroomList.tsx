import React, { useEffect, useState } from 'react';
import { FaSearch, FaTrash, FaSync, FaSortUp, FaSortDown } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { AdminGetClassroomListMessage } from 'Plugins/AdminAPI/AdminGetClassroomListMessage';
import { AdminDeleteClassroomMessage } from 'Plugins/AdminAPI/AdminDeleteClassroomMessage';
import { Classroom, sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { AdminGetClassroomMessage } from 'Plugins/AdminAPI/AdminGetClassroomMessage';

export function AdminClassroomList() {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchColumn, setSearchColumn] = useState<'All' | 'id' | 'name'>('All');
    const [errorMessage, setErrorMessage] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof Classroom>('classroomid');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [enrolledCoursesCount, setEnrolledCoursesCount] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        fetchClassrooms();
    }, []);

    useEffect(() => {
        const fetchCounts = async () => {
            const counts: { [key: number]: number } = {};
            for (const classroom of classrooms) {
                const count = await countTotalCourses(classroom.classroomid);
                counts[classroom.classroomid] = count;
            }
            setEnrolledCoursesCount(counts);
        };

        if (classrooms.length > 0) {
            fetchCounts();
        }
    }, [classrooms]);

    const fetchClassrooms = async () => {
        try {
            const response = await sendPostRequest(new AdminGetClassroomListMessage());
            if (response.isError) {
                setErrorMessage(response.error);
            } else {
                setClassrooms(response.data);
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage('Failed to fetch classrooms');
        }
    };

    const handleDelete = async (classroomid: number) => {
        try {
            const response = await sendPostRequest(new AdminDeleteClassroomMessage(classroomid));
            if (!response.isError) {
                fetchClassrooms();
            } else {
                setErrorMessage(`Failed to delete classroom: ${response.error}`);
            }
        } catch (error) {
            setErrorMessage('An error occurred while trying to delete the classroom.');
        }
    };

    const handleSort = (column: keyof Classroom) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedClassrooms = [...classrooms].sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortColumn] < b[sortColumn] ? -1 : 1;
        } else {
            return a[sortColumn] > b[sortColumn] ? -1 : 1;
        }
    });

    const filterClassrooms = (classrooms: Classroom[]) => {
        return classrooms.filter(classroom => {
            if (searchTerm === '') return true;
            const lowerSearchTerm = searchTerm.toLowerCase();
            switch (searchColumn) {
                case 'id':
                    return classroom.classroomid.toString().includes(lowerSearchTerm);
                case 'name':
                    return classroom.classroomName.toLowerCase().includes(lowerSearchTerm);
                case 'All':
                    return (
                        classroom.classroomid.toString().includes(lowerSearchTerm) ||
                        classroom.classroomName.toLowerCase().includes(lowerSearchTerm)
                    );
                default:
                    return true;
            }
        });
    };

    const filteredAndSortedClassrooms = filterClassrooms(sortedClassrooms);

    const SortIcon = ({ column }: { column: keyof Classroom }) => {
        if (column !== sortColumn) return null;
        return sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
    };

    const renderSortableHeader = (column: keyof Classroom, label: string) => (
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

    async function countTotalCourses(classroomid: number): Promise<number> {
        try {
            const response = await sendPostRequest(new AdminGetClassroomMessage(classroomid));
            const classroom = response.data;
            return Object.keys(classroom.enrolledCourses).length;
        } catch (error) {
            return 0;
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Classroom List</h2>
                    <button
                        onClick={fetchClassrooms}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded transition duration-300"
                        title="Refresh classroom list"
                    >
                        <FaSync />
                    </button>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                    <select
                        value={searchColumn}
                        onChange={(e) => setSearchColumn(e.target.value as 'All' | 'id' | 'name')}
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="All">All</option>
                        <option value="id">ClassroomID</option>
                        <option value="name">ClassroomName</option>
                    </select>
                    <div className="relative flex-grow" style={{ flexBasis: '80%' }}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search classrooms..."
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>

                <table className="classroom-list min-w-full divide-y divide-gray-200 mt-4 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {renderSortableHeader('classroomid', 'Classroom ID')}
                        {renderSortableHeader('classroomName', 'Classroom Name')}
                        {renderSortableHeader('capacity', 'Capacity')}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                            Enrolled Course Numbers
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {filteredAndSortedClassrooms.map((classroom: Classroom) => (
                        <tr key={classroom.classroomid}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                                <Link
                                    to={`/admin/classroom/${classroom.classroomid}`}
                                    className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-500"
                                >
                                    {classroom.classroomid}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {classroom.classroomName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {classroom.capacity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {enrolledCoursesCount[classroom.classroomid]}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <button
                                    onClick={() => handleDelete(classroom.classroomid)}
                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-500"
                                    title="Delete Classroom"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
        </AdminLayout>
    );
}
