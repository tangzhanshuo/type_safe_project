import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { API } from 'Plugins/CommonUtils/API';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherGetCourseMessage } from 'Plugins/TeacherAPI/TeacherGetCourseMessage';
import { TeacherDeleteCourseMessage } from 'Plugins/TeacherAPI/TeacherDeleteCourseMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import 'Pages/css/Main.css';

interface Course {
    courseid: number;
    coursename: string;
    capacity: number;
    credits: number;
    info: string;
    coursehour: string;
    classroomid: number;
    enrolledstudents: string[];
    teachername: string;
}

export function TeacherCourse() {
    const history = useHistory();
    const { courseid } = useParams<{ courseid: string }>();
    const [errorMessage, setErrorMessage] = useState('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState('');
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            history.push('/login');
        } else if (usertype !== 'teacher') {
            history.push('/');
        } else {
            getCourse();
        }
    }, [courseid, history]);

    const getCourse = async () => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setErrorMessage('Invalid course ID');
            return;
        }

        const response = await sendPostRequest(new TeacherGetCourseMessage(id));
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }
        try {
            const parsedCourse: Course = JSON.parse(response.data);
            setCourse(parsedCourse);
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
        setIsLoading(false);
    }

    const deleteCourse = async () => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setDeleteCourseResponse('Invalid course ID');
            return;
        }
        const response = await sendPostRequest(new TeacherDeleteCourseMessage(id));
        if (response.isError) {
            setDeleteCourseResponse(response.error);
            return;
        }
        setDeleteCourseResponse('Course deleted successfully');
        // Redirect to course list after successful deletion
        setTimeout(() => history.push('/teacher/course'), 2000);
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Course Details</h1>
            </header>
            <main className="App-main">
                <div className="course-details">
                    {errorMessage ? (
                        <p style={{ color: 'red' }}>{errorMessage}</p>
                    ) : isLoading ? (
                        <p>Loading course details...</p>
                    ) : course ? (
                        <>
                            <h2>{course.coursename}</h2>
                            <table className="details-table">
                                <tbody>
                                <tr>
                                    <th>Course ID:</th>
                                    <td>{course.courseid}</td>
                                </tr>
                                <tr>
                                    <th>Teacher:</th>
                                    <td>{course.teachername}</td>
                                </tr>
                                <tr>
                                    <th>Capacity:</th>
                                    <td>{course.capacity}</td>
                                </tr>
                                <tr>
                                    <th>Credits:</th>
                                    <td>{course.credits}</td>
                                </tr>
                                <tr>
                                    <th>Info:</th>
                                    <td>{course.info}</td>
                                </tr>
                                <tr>
                                    <th>Course Hours:</th>
                                    <td>{course.coursehour}</td>
                                </tr>
                                <tr>
                                    <th>Classroom ID:</th>
                                    <td>{course.classroomid}</td>
                                </tr>
                                <tr>
                                    <th>Enrolled Students:</th>
                                    <td>{course.enrolledstudents}</td>
                                </tr>
                                </tbody>
                            </table>
                            {deleteCourseResponse && <p>{deleteCourseResponse}</p>}
                        </>
                    ) : (
                        <p>No course data available.</p>
                    )}
                    <div className="button-group">
                        <button onClick={() => history.push('/teacher/coursedetail')} className="button">
                            Back to Course List
                        </button>
                        <button onClick={() => history.push('/teacher')} className="button">
                            Back to TeacherMain
                        </button>
                        <button onClick={() => logout(history)} className="button">
                            Log out
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}