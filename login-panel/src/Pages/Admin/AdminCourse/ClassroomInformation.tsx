import React, { useState } from 'react';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminAddClassroomMessage } from 'Plugins/AdminAPI/AdminAddClassroomMessage';
import { AdminGetClassroomMessage } from 'Plugins/AdminAPI/AdminGetClassroomMessage';
import { AdminDeleteClassroomMessage } from 'Plugins/AdminAPI/AdminDeleteClassroomMessage';

interface Props {
    setErrorMessage: (msg: string) => void;
    setSuccessMessage: (msg: string) => void;
    setClassroomDetails: (details: any) => void;
}

export const ClassroomInformation: React.FC<Props> = ({ setErrorMessage, setSuccessMessage, setClassroomDetails }) => {
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
        <section className="classroom-info">
            <h2>Classroom Information</h2>
            <div className="input-group">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Classroom ID (Number)"
                        value={classroomID}
                        onChange={(e) => setClassroomID(e.target.value)}
                        className="input-field"
                    />
                    <label>Classroom ID (Number)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Classroom Name (Text)"
                        value={classroomName}
                        onChange={(e) => setClassroomName(e.target.value)}
                        className="input-field"
                    />
                    <label>Classroom Name (Text)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Capacity (Number)"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="input-field"
                    />
                    <label>Capacity (Number)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enrolled Courses (JSON Dict[List[Number]])"
                        value={enrolledCoursesJson}
                        onChange={(e) => setEnrolledCoursesJson(e.target.value)}
                        className="input-field"
                    />
                    <label>Enrolled Courses (JSON Dict[List[Number]])</label>
                </div>
            </div>
            <div className="button-group">
                <button onClick={handleAddClassroom} className="button">
                    Add Classroom
                </button>
                <button onClick={handleGetClassroom} className="button">
                    Get Classroom Details
                </button>
                <button onClick={handleDeleteClassroom} className="button">
                    Delete Classroom
                </button>
            </div>
        </section>
    );
};
