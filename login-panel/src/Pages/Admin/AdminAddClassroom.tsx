import React, { useState } from 'react';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminAddClassroomMessage } from 'Plugins/AdminAPI/AdminAddClassroomMessage';
import { AdminGetClassroomMessage } from 'Plugins/AdminAPI/AdminGetClassroomMessage';
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { FaRegPlusSquare } from 'react-icons/fa';

export function AdminAddClassroom(): JSX.Element {
    const [classroomID, setClassroomID] = useState('');
    const [classroomName, setClassroomName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [addClassroomResponse, setAddClassroomResponse] = useState<string>('');

    const fetchClassroomInfo = async (classroomid: number): Promise<boolean> => {
        const response = await sendPostRequest(new AdminGetClassroomMessage(classroomid));
        return !response.isError;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'classroomID') setClassroomID(value);
        else if (name === 'classroomName') setClassroomName(value);
        else if (name === 'capacity') setCapacity(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericClassroomID = parseInt(classroomID, 10);
        if (isNaN(numericClassroomID)) {
            setAddClassroomResponse('Error: Classroom ID must be a number');
            return;
        }
        const classroomExists = await fetchClassroomInfo(numericClassroomID);
        if (classroomExists) {
            setAddClassroomResponse('Error: Classroom ID already in use');
            return;
        }

        const response = await sendPostRequest(new AdminAddClassroomMessage(
            numericClassroomID,
            classroomName,
            parseInt(capacity, 10),
            ''
        ));
        if (response.isError) {
            setAddClassroomResponse(response.error);
        } else {
            setAddClassroomResponse('Classroom added successfully');
            setClassroomID('');
            setClassroomName('');
            setCapacity('');
        }
    }

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="classroomID" className="block text-sm font-medium text-gray-700">Classroom
                        ID</label>
                    <input
                        type="number"
                        name="classroomID"
                        id="classroomID"
                        value={classroomID.toString()}
                        onChange={handleInputChange}
                        className="mt-1 block w-1/2 px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="classroomName" className="block text-sm font-medium text-gray-700">Classroom
                        Name</label>
                    <input
                        type="text"
                        name="classroomName"
                        id="classroomName"
                        value={classroomName}
                        onChange={handleInputChange}
                        className="mt-1 block w-1/2 px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                    <input
                        type="number"
                        name="capacity"
                        id="capacity"
                        value={capacity.toString()}
                        onChange={handleInputChange}
                        className="mt-1 block w-1/2 px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-1/4 flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <FaRegPlusSquare className="mr-2" /> Add Classroom
                </button>
                {addClassroomResponse && (
                    <div className={`mt-3 text-center text-sm font-medium ${addClassroomResponse.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                        {addClassroomResponse}
                    </div>
                )}
            </form>
        </AdminLayout>
    );
}

