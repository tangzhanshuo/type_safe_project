import React, { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { AdminAddCourseMessage } from 'Plugins/AdminAPI/AdminAddCourseMessage';
import { AdminGetCourseMessage } from 'Plugins/AdminAPI/AdminGetCourseMessage';
import { AdminDeleteCourseMessage } from 'Plugins/AdminAPI/AdminDeleteCourseMessage';
import { AdminUpdateCourseMessage } from 'Plugins/AdminAPI/AdminUpdateCourseMessage';
import { AdminAddStudent2CourseMessage } from 'Plugins/AdminAPI/AdminAddStudent2CourseMessage';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import 'Pages/css/Main.css';
import Auth from 'Plugins/CommonUtils/AuthState'; // Import the CSS file

export function AdminCourse() {
    const history = useHistory();
    const [courseID, setCourseID] = useState('');
    const [courseName, setCourseName] = useState('');
    const [teacherUsername, setTeacherUsername] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [info, setInfo] = useState('');
    const [courseHourJson, setCourseHourJson] = useState('');
    const [classroomID, setClassroomID] = useState('');
    const [credits, setCredits] = useState('');
    const [enrolledStudentsJson, setEnrolledStudentsJson] = useState('');
    const [kwargsJson, setKwargsJson] = useState('');
    const [studentUsername, setStudentUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [courseDetails, setCourseDetails] = useState<any>(null);

    useEffect(() => {
        const { usertype, username, password } = Auth.getState();

        if (!usertype || !username || !password) {
            history.push('/login');
        }

        if (usertype !== 'admin') {
            history.push('/');
        }
    }, []);

    const handleAddCourse = async () => {
        if (!courseID || !courseName || !teacherUsername || !teacherName || !capacity || !info || !courseHourJson || !classroomID || !credits || !enrolledStudentsJson || !kwargsJson) {
            setErrorMessage('All fields are required');
            return;
        }

        const message = new AdminAddCourseMessage(
            parseInt(courseID, 10),
            courseName,
            teacherUsername,
            teacherName,
            parseInt(capacity, 10),
            info,
            courseHourJson,
            parseInt(classroomID, 10), // Added classroomID
            parseInt(credits, 10),
            enrolledStudentsJson,
            kwargsJson
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


    const handleGetCourse = async () => {
        if (!courseID) {
            setErrorMessage('Course ID is required');
            return;
        }

        const message = new AdminGetCourseMessage(parseInt(courseID, 10));

        try {
            const response = await sendPostRequest(message);
            if (response.status === 200) {
                setCourseDetails(response.data);
                setSuccessMessage('Course details retrieved successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to retrieve course details');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while retrieving course details');
            setSuccessMessage('');
        }
    };

    const handleDeleteCourse = async () => {
        if (!courseID) {
            setErrorMessage('Course ID is required');
            return;
        }

        const message = new AdminDeleteCourseMessage(parseInt(courseID, 10));

        try {
            const response = await sendPostRequest(message);
            if (response.status === 200) {
                setSuccessMessage('Course deleted successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to delete course');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while deleting course');
            setSuccessMessage('');
        }
    };

    const handleUpdateCourse = async () => {
        if (!courseID) {
            setErrorMessage('Course ID is required');
            return;
        }

        const message = new AdminUpdateCourseMessage(
            parseInt(courseID, 10),
            courseName || undefined,
            teacherUsername || undefined,
            teacherName || undefined,
            capacity ? parseInt(capacity, 10) : undefined,
            info || undefined,
            courseHourJson || undefined,
            classroomID ? parseInt(classroomID, 10) : undefined, // Added classroomID
            credits ? parseInt(credits, 10) : undefined,
            enrolledStudentsJson || undefined,
            kwargsJson || undefined
        );

        try {
            const response = await sendPostRequest(message);
            if (response.status === 200) {
                setSuccessMessage('Course updated successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to update course');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while updating course');
            setSuccessMessage('');
        }
    };


    const handleAddStudent2Course = async () => {
        if (!courseID || !studentUsername) {
            setErrorMessage('Course ID and Student Username are required');
            return;
        }

        const message = new AdminAddStudent2CourseMessage(
            parseInt(courseID, 10),
            studentUsername
        );

        try {
            const response = await sendPostRequest(message);
            if (response.status === 200) {
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
                    <input
                        type="text"
                        placeholder="Info"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Course Hour (JSON)"
                        value={courseHourJson}
                        onChange={(e) => setCourseHourJson(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Classroom ID"
                        value={classroomID}
                        onChange={(e) => setClassroomID(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Credits"
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Enrolled Students (JSON)"
                        value={enrolledStudentsJson}
                        onChange={(e) => setEnrolledStudentsJson(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Kwargs (JSON)"
                        value={kwargsJson}
                        onChange={(e) => setKwargsJson(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Student Username"
                        value={studentUsername}
                        onChange={(e) => setStudentUsername(e.target.value)}
                        className="input-field"
                    />
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <div className="button-group">
                    <button onClick={handleAddCourse} className="button">
                        Add Course
                    </button>
                    <button onClick={handleGetCourse} className="button">
                        Get Course Details
                    </button>
                    <button onClick={handleUpdateCourse} className="button">
                        Update Course
                    </button>
                    <button onClick={handleDeleteCourse} className="button">
                        Delete Course
                    </button>
                    <button onClick={handleAddStudent2Course} className="button">
                        Add Student to Course
                    </button>
                    <button onClick={() => history.push('/')} className="button">
                        Back to main
                    </button>
                </div>
                {courseDetails && (
                    <div className="course-details">
                        <pre>{JSON.stringify(courseDetails, null, 2)}</pre>
                    </div>
                )}
            </main>
        </div>
    );
}
