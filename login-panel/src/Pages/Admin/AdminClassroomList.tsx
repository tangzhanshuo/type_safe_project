import React, { useEffect, useState } from 'react';
import { FaSearch, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { AdminGetClassroomListMessage } from 'Plugins/AdminAPI/AdminGetClassroomListMessage';
import { AdminDeleteClassroomMessage } from 'Plugins/AdminAPI/AdminDeleteClassroomMessage';
import { Classroom, sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { AdminGetClassroomMessage } from 'Plugins/AdminAPI/AdminGetClassroomMessage';

export function AdminClassroomList() {
    const [classrooms, setClassrooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchColumn, setSearchColumn] = useState('All');
    const [errorMessage, setErrorMessage] = useState('');
    const [filteredClassroomsResponse, setFilteredClassroomsResponse] = useState([]);
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
            console.log('Response:', response);
            setClassrooms(response.data);
        } catch (error) {
            setErrorMessage('Failed to fetch classrooms');
        }
    };

    const handleDelete = async (classroomid: number) => {
        console.log(classroomid);
        try {
            const response = await sendPostRequest(new AdminDeleteClassroomMessage(classroomid));
            if (!response.isError) {
                console.log('Deletion successful');
                fetchClassrooms();
            } else {
                console.error('Failed to delete classroom:', response.error);
                setErrorMessage(`Failed to delete classroom: ${response.error}`);
            }
        } catch (error) {
            console.error('Error deleting classroom:', error);
            setErrorMessage('An error occurred while trying to delete the classroom.');
        }
    };

    const filteredClassrooms = (classrooms: Classroom[], searchTerm: string, searchColumn: string) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return classrooms.filter((classroom) => {
            const classroomIdStr = classroom.classroomid.toString().toLowerCase();
            const classroomNameLower = classroom.classroomName.toLowerCase();

            if (searchColumn === 'All') {
                return classroomIdStr === lowerCaseSearchTerm || classroomNameLower === lowerCaseSearchTerm;
            } else if (searchColumn === 'id') {
                return classroomIdStr === lowerCaseSearchTerm;
            } else if (searchColumn === 'name') {
                return classroomNameLower === lowerCaseSearchTerm;
            }

            return true;
        });
    };

    const filteredClassroomsResult = filteredClassrooms(classrooms, searchTerm, searchColumn);

    async function countTotalCourses(classroomid: number): Promise<number> {
        try {
            const response = await sendPostRequest(new AdminGetClassroomMessage(classroomid));
            const classroom = response.data;
            console.log(classroom);
            return Object.keys(classroom.enrolledCourses).length;
        } catch (error) {
            console.error('Error fetching classroom details:', error);
        }
        return 0;
    }

    return (
        <AdminLayout>
            <div className="flex items-center space-x-4 mb-4">
                <select
                    value={searchColumn}
                    onChange={(e) => setSearchColumn(e.target.value)}
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
                        placeholder="Search courses..."
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
                <button
                    onClick={() => setFilteredClassroomsResponse(filteredClassrooms(classrooms, searchTerm, searchColumn))}
                    className="search-button bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                    Search
                </button>
            </div>

            <table className="classroom-list min-w-full divide-y divide-gray-200 mt-4 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                        Classroom ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                        Classroom Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                        Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                        Enrolled Course Numbers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredClassroomsResult.map((classroom: Classroom) => (
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
        </AdminLayout>
    );
}
