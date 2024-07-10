import React, { useState } from 'react';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminAddStudent2CourseMessage } from 'Plugins/AdminAPI/AdminAddStudent2CourseMessage';
import { AdminDeleteStudentFromCourseMessage } from 'Plugins/AdminAPI/AdminDeleteStudentFromCourseMessage';

interface Props {
    setErrorMessage: (msg: string) => void;
    setSuccessMessage: (msg: string) => void;
}

export const StudentInformation: React.FC<Props> = ({ setErrorMessage, setSuccessMessage }) => {
    const [studentCourseID, setStudentCourseID] = useState('');
    const [studentUsername, setStudentUsername] = useState('');
    const [studentPriority, setStudentPriority] = useState('');
    const handleAddStudent2Course = async () => {
        if (!studentCourseID || !studentUsername) {
            setErrorMessage('Course ID and Student Username are required');
            return;
        }

        const message = new AdminAddStudent2CourseMessage(
            parseInt(studentCourseID, 10),
            studentUsername,
            parseInt(studentPriority, 10)
        );

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
                setSuccessMessage('Student added to course successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to add student to course');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while adding student to course');
            setSuccessMessage('');
        }
    };

    const handleDeleteStudentFromCourse = async () => {
        if (!studentCourseID || !studentUsername) {
            setErrorMessage('Course ID and Student Username are required');
            return;
        }

        const message = new AdminDeleteStudentFromCourseMessage(
            parseInt(studentCourseID, 10),
            studentUsername
        );

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
                setSuccessMessage('Student deleted from course successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to delete student from course');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while deleting student from course');
            setSuccessMessage('');
        }
    };

    return (
        <section className="student-info">
            <h2>Student Information</h2>
            <div className="input-group">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Course ID (Number)"
                        value={studentCourseID}
                        onChange={(e) => setStudentCourseID(e.target.value)}
                        className="input-field"
                    />
                    <label>Course ID (Number)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Student Username (Text)"
                        value={studentUsername}
                        onChange={(e) => setStudentUsername(e.target.value)}
                        className="input-field"
                    />
                    <label>Student Username (Text)</label>
                </div>
                <div className="input-container">
                    <input
                        type="number"
                        placeholder="Student Priority (Number)"
                        value={studentPriority}
                        onChange={(e) => setStudentPriority(e.target.value)}
                        className="input-field"
                    />
                    <label>Student Priority (Number)</label>
                </div>
            </div>
            <div className="button-group">
                <button onClick={handleAddStudent2Course} className="button">
                    Add Student to Course
                </button>
                <button onClick={handleDeleteStudentFromCourse} className="button">
                    Delete Student from Course
                </button>
            </div>
        </section>
    );
};
