import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { UserAddCourseMessage } from 'Plugins/UserAPI/UserAddCourseMessage';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/API/Utils';
import './css/Main.css'; // Import the CSS file

export function AdminCourse() {
    const history = useHistory();
    const [courseID, setCourseID] = useState('');
    const [courseName, setCourseName] = useState('');
    const [teacherUsername, setTeacherUsername] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleAddCourse = async () => {
        if (!courseID || !courseName || !teacherUsername || !teacherName || !capacity) {
            setErrorMessage('All fields are required');
            return;
        }

        const message = new UserAddCourseMessage(
            parseInt(courseID, 10),
            courseName,
            teacherUsername,
            teacherName,
            parseInt(capacity, 10)
        );

        try {
            const response = await sendPostRequest(message);
            if (response.status === 200) {
                setSuccessMessage('Course added successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to add course');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while adding course');
            setSuccessMessage('');
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Admin Course Management</h1>
            </header>
            <main className="App-main">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Course ID"
                        value={courseID}
                        onChange={(e) => setCourseID(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Course Name"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Teacher Username"
                        value={teacherUsername}
                        onChange={(e) => setTeacherUsername(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Teacher Name"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Capacity"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="input-field"
                    />
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <div className="button-group">
                    <button onClick={handleAddCourse} className="button">
                        Add Course
                    </button>
                    <button onClick={() => history.push('/')} className="button">
                        Back to main
                    </button>
                </div>
            </main>
        </div>
    );
}
