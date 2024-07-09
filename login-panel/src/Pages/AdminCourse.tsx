import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AdminAddCourseMessage } from 'Plugins/AdminAPI/AdminAddCourseMessage';
import { AdminGetCourseMessage } from 'Plugins/AdminAPI/AdminGetCourseMessage';
import { AdminGetCourseListMessage } from 'Plugins/AdminAPI/AdminGetCourseListMessage';
import { AdminDeleteCourseMessage } from 'Plugins/AdminAPI/AdminDeleteCourseMessage';
import { AdminUpdateCourseMessage } from 'Plugins/AdminAPI/AdminUpdateCourseMessage';
import { AdminAddStudent2CourseMessage } from 'Plugins/AdminAPI/AdminAddStudent2CourseMessage';
import { AdminDeleteStudentFromCourseMessage } from 'Plugins/AdminAPI/AdminDeleteStudentFromCourseMessage';
import { AdminAddClassroomMessage } from 'Plugins/AdminAPI/AdminAddClassroomMessage';
import { AdminDeleteClassroomMessage } from 'Plugins/AdminAPI/AdminDeleteClassroomMessage';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import Auth from 'Plugins/CommonUtils/AuthState';
import 'Pages/css/Main.css';

export function AdminCourse() {
    const history = useHistory();
    const [activeSection, setActiveSection] = useState('course');
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
    const [studentCourseID, setStudentCourseID] = useState('');
    const [studentUsername, setStudentUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [courseDetails, setCourseDetails] = useState<any>(null);
    const [courseList, setCourseList] = useState<any[]>([]);

    const [classroomName, setClassroomName] = useState('');
    const [enrolledCoursesJson, setEnrolledCoursesJson] = useState('');

    useEffect(() => {
        const { usertype, username, password } = Auth.getState();

        if (!usertype || !username || !password) {
            history.push('/login');
        }

        if (usertype !== 'admin') {
            history.push('/');
        }
    }, [history]);

    useEffect(() => {
        const fetchCourseList = async () => {
            try {
                const message = new AdminGetCourseListMessage();
                const response = await sendPostRequest(message);
                if (!response.isError) {
                    setCourseList(response.data);
                } else {
                    setErrorMessage('Failed to retrieve course list');
                }
            } catch (error) {
                setErrorMessage('Error occurred while retrieving course list');
            }
        };

        fetchCourseList(); // Initial fetch

        const intervalId = setInterval(fetchCourseList, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
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
            parseInt(classroomID, 10),
            parseInt(credits, 10),
            enrolledStudentsJson,
            kwargsJson
        );

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
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
            if (!response.isError) {
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
            if (!response.isError) {
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
            classroomID ? parseInt(classroomID, 10) : undefined,
            credits ? parseInt(credits, 10) : undefined,
            enrolledStudentsJson || undefined,
            kwargsJson || undefined
        );

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
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
        if (!studentCourseID || !studentUsername) {
            setErrorMessage('Course ID and Student Username are required');
            return;
        }

        const message = new AdminAddStudent2CourseMessage(
            parseInt(studentCourseID, 10),
            studentUsername
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


    const handleAddClassroom = async () => {
        if (!classroomID || !classroomName || !enrolledCoursesJson) {
            setErrorMessage('All fields are required for adding classroom');
            return;
        }

        const message = new AdminAddClassroomMessage(
            parseInt(classroomID, 10),
            classroomName,
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
        <div className="App">
            <button onClick={() => history.push('/')} className="back-to-main">
                Back to main
            </button>
            <header className="App-header">
                <h1>Admin Course Management</h1>
            </header>
            <main className="App-main">
                <div className="button-group">
                    <button onClick={() => setActiveSection('course')} className="button">
                        Course Information
                    </button>
                    <button onClick={() => setActiveSection('student')} className="button">
                        Student Information
                    </button>
                    <button onClick={() => setActiveSection('classroom')} className="button">
                        Classroom Information
                    </button>
                </div>
                {activeSection === 'course' && (
                    <section className="course-info">
                        <h2>Course Information</h2>
                        <div className="input-group">
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Course ID (Number)"
                                    value={courseID}
                                    onChange={(e) => setCourseID(e.target.value)}
                                    className="input-field"
                                />
                                <label>Course ID (Number)</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Course Name (Text)"
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                    className="input-field"
                                />
                                <label>Course Name (Text)</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Teacher Username (Text)"
                                    value={teacherUsername}
                                    onChange={(e) => setTeacherUsername(e.target.value)}
                                    className="input-field"
                                />
                                <label>Teacher Username (Text)</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Teacher Name (Text)"
                                    value={teacherName}
                                    onChange={(e) => setTeacherName(e.target.value)}
                                    className="input-field"
                                />
                                <label>Teacher Name (Text)</label>
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
                                    placeholder="Info (Text)"
                                    value={info}
                                    onChange={(e) => setInfo(e.target.value)}
                                    className="input-field"
                                />
                                <label>Info (Text)</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Course Hour (JSON List[Number])"
                                    value={courseHourJson}
                                    onChange={(e) => setCourseHourJson(e.target.value)}
                                    className="input-field"
                                />
                                <label>Course Hour (JSON List[Number])</label>
                            </div>
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
                                    placeholder="Credits (Number)"
                                    value={credits}
                                    onChange={(e) => setCredits(e.target.value)}
                                    className="input-field"
                                />
                                <label>Credits (Number)</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Enrolled Students (JSON List[Text])"
                                    value={enrolledStudentsJson}
                                    onChange={(e) => setEnrolledStudentsJson(e.target.value)}
                                    className="input-field"
                                />
                                <label>Enrolled Students (JSON List[Text])</label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Kwargs (JSON)"
                                    value={kwargsJson}
                                    onChange={(e) => setKwargsJson(e.target.value)}
                                    className="input-field"
                                />
                                <label>Kwargs (JSON)</label>
                            </div>
                        </div>
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
                        </div>
                    </section>
                )}
                {activeSection === 'student' && (
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

                )}
                {activeSection === 'classroom' && (
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
                                    placeholder="Enrolled Courses (JSON List[Number])"
                                    value={enrolledCoursesJson}
                                    onChange={(e) => setEnrolledCoursesJson(e.target.value)}
                                    className="input-field"
                                />
                                <label>Enrolled Courses (JSON List[Number])</label>
                            </div>
                        </div>
                        <div className="button-group">
                            <button onClick={handleAddClassroom} className="button">
                                Add Classroom
                            </button>
                            <button onClick={handleDeleteClassroom} className="button">
                                Delete Classroom
                            </button>
                        </div>
                    </section>
                )}
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                {courseDetails && (
                    <div className="course-details">
                        <pre>{JSON.stringify(courseDetails, null, 2)}</pre>
                    </div>
                )}
                {courseList.length > 0 && (
                    <div className="course-list">
                        <h2>Course List</h2>
                        <div className="table-container">
                            <table className="course-table">
                                <thead>
                                <tr>
                                    <th>Course ID</th>
                                    <th>Course Name</th>
                                    <th>Teacher Username</th>
                                    <th>Teacher Name</th>
                                    <th>Capacity</th>
                                    <th className="long-text">Info</th>
                                    <th>Course Hour</th>
                                    <th>Classroom ID</th>
                                    <th>Credits</th>
                                    <th className="long-text">Enrolled Students</th>
                                    <th>Kwargs</th>
                                </tr>
                                </thead>
                                <tbody>
                                {courseList.map((course, index) => (
                                    <tr key={index}>
                                        <td>{course.courseid}</td>
                                        <td>{course.coursename}</td>
                                        <td>{course.teacherusername}</td>
                                        <td>{course.teachername}</td>
                                        <td>{course.capacity}</td>
                                        <td className="long-text">{course.info}</td>
                                        <td>{course.coursehour}</td>
                                        <td>{course.classroomid}</td>
                                        <td>{course.credits}</td>
                                        <td className="long-text">{course.enrolledstudents}</td>
                                        <td>{course.kwargs}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
