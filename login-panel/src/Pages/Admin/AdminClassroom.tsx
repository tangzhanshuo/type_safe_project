import React, { useState } from 'react';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminAddClassroomMessage } from 'Plugins/AdminAPI/AdminAddClassroomMessage';
import { AdminGetClassroomMessage } from 'Plugins/AdminAPI/AdminGetClassroomMessage';
import { AdminDeleteClassroomMessage } from 'Plugins/AdminAPI/AdminDeleteClassroomMessage';
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { FaUserPlus, FaUserTimes, FaUserEdit } from 'react-icons/fa';
interface Props {
    setErrorMessage: (msg: string) => void;
    setSuccessMessage: (msg: string) => void;
    setClassroomDetails: (details: any) => void;
}

export const AdminClassroom: React.FC<Props> = ({ setErrorMessage, setSuccessMessage, setClassroomDetails }) => {
    const [classroomID, setClassroomID] = useState('');
    const [classroomName, setClassroomName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [enrolledCoursesJson, setEnrolledCoursesJson] = useState('');

    const handleAddClassroom = async () => {
        if (!classroomID || !classroomName || !enrolledCoursesJson) {
            setErrorMessage('All fields are required for adding classroom');
            return;
        }

        const message = new AdminAddClassroomMessage(
            parseInt(classroomID, 10),
            classroomName,
            parseInt(capacity, 10),  // Ensure capacity is properly parsed
            enrolledCoursesJson
        );

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
                setSuccessMessage('Classroom added successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to add classroom');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while adding classroom');
            setSuccessMessage('');
        }
    };

    const handleGetClassroom = async () => {
        if (!classroomID) {
            setErrorMessage('Classroom ID is required');
            return;
        }

        const message = new AdminGetClassroomMessage(parseInt(classroomID, 10));

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
                setClassroomDetails(response.data);
                setSuccessMessage('Classroom details retrieved successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to retrieve classroom details');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while retrieving classroom details');
            setSuccessMessage('');
        }
    };

    const handleDeleteClassroom = async () => {
        if (!classroomID) {
            setErrorMessage('Classroom ID is required for deleting classroom');
            return;
        }

        const message = new AdminDeleteClassroomMessage(parseInt(classroomID, 10));

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
                setSuccessMessage('Classroom deleted successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to delete classroom');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while deleting classroom');
            setSuccessMessage('');
        }
    };

    return (
        <AdminLayout> {/* Wrap content with AdminLayout */}
            <section className="classroom-info">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="input-group">
                        <div className="input-container" style={{marginBottom: '15px'}}>
                            <input
                                type="text"
                                placeholder="Classroom ID (Number)"
                                value={classroomID}
                                onChange={(e) => setClassroomID(e.target.value)}
                                className="input-field dark:bg-gray-700 dark:text-white p-2 rounded-md border border-gray-400 focus:border-gray-500"
                                style={{width: '100%'}}
                            />
                        </div>
                        <div className="input-container" style={{marginBottom: '15px'}}>
                            <input
                                type="text"
                                placeholder="Classroom Name (Text)"
                                value={classroomName}
                                onChange={(e) => setClassroomName(e.target.value)}
                                className="input-field dark:bg-gray-700 dark:text-white p-2 rounded-md border border-gray-400 focus:border-gray-500"
                                style={{width: '100%'}}
                            />
                        </div>
                        <div className="input-container" style={{marginBottom: '15px'}}>
                            <input
                                type="text"
                                placeholder="Capacity (Number)"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="input-field dark:bg-gray-700 dark:text-white p-2 rounded-md border border-gray-400 focus:border-gray-500"
                                style={{width: '100%'}}
                            />
                        </div>
                        <div className="input-container" style={{marginBottom: '15px'}}>
                            <input
                                type="text"
                                placeholder="Enrolled Courses (JSON Dict[List[Number]])"
                                value={enrolledCoursesJson}
                                onChange={(e) => setEnrolledCoursesJson(e.target.value)}
                                className="input-field dark:bg-gray-700 dark:text-white p-2 rounded-md border border-gray-400 focus:border-gray-500"
                                style={{width: '100%'}}
                            />
                        </div>

                        <div className="flex items-center space-x-4 p-4">
                            <button onClick={handleAddClassroom}
                                    className="bg-blue-400 hover:bg-blue-500 text-gray-100 font-semibold py-2 px-4 rounded-full shadow transition ease-in-out duration-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white flex items-center justify-center">
                                <FaUserPlus className="pr-2" size="24"/> <span>Add Classroom</span>
                            </button>
                            <button onClick={handleGetClassroom}
                                    className="bg-green-500 hover:bg-green-600 text-gray-100 font-semibold py-2 px-4 rounded-full shadow transition ease-in-out duration-500 dark:bg-green-600 dark:hover:bg-green-700 dark:text-white flex items-center justify-center">
                                <FaUserEdit className="pr-2" size="24"/> <span>Get Classroom Details</span>
                            </button>
                            <button onClick={handleDeleteClassroom}
                                    className="bg-red-400 hover:bg-red-500 text-gray-100 font-semibold py-2 px-4 rounded-full shadow transition ease-in-out duration-500 dark:bg-red-500 dark:hover:bg-red-600 dark:text-white flex items-center justify-center">
                                <FaUserTimes className="pr-2" size="24"/> <span>Delete Classroom</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
