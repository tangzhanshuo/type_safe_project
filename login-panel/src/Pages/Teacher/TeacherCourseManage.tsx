import React, { useEffect, useState } from 'react';
import { API } from 'Plugins/CommonUtils/API';
import { useParams, useHistory, Link } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest'
import { TeacherGetCourseMessage } from 'Plugins/TeacherAPI/TeacherGetCourseMessage'
import { TeacherAddCourseMessage } from 'Plugins/TeacherAPI/TeacherAddCourseMessage'
import { TeacherDeleteCourseMessage } from "Plugins/TeacherAPI/TeacherDeleteCourseMessage";
import { logout } from 'Plugins/CommonUtils/UserManager'
import Auth from 'Plugins/CommonUtils/AuthState';
import 'Pages/css/Main.css'; // Import the CSS file

export function TeacherCourseManage() {
    const history = useHistory();
    const { courseid } = useParams<{ courseid: string }>();
    const [errorMessage, setErrorMessage] = useState('');
    const [addCourseResponse, setAddCourseResponse] = useState('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState('');
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { usertype, username, password } = Auth.getState();

        if (!usertype || !username || !password) {
            history.push('/login');
        } else if (usertype !== 'teacher') {
            history.push('/');
        } else {
            getCourse();
        }
    }, [courseid]);

    const getCourse = async () => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setErrorMessage('Invalid course ID');
            return;
        }

        const response = await sendPostRequest(new TeacherGetCourseMessage(id))
        if (response.isError) {
            setErrorMessage(response.error)
            return
        }
        try {
            const parsedCourses = JSON.parse(response.data);
            setCourse(parsedCourses);
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    }

    const addCourse = async () => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setAddCourseResponse('Invalid course ID');
            return;
        }
        const name = course.coursename;
        if (typeof name !== 'string') {
            setAddCourseResponse('Invalid course Name');
            return;
        }
        const teacherusername = course.teacherusername;
        if (typeof teacherusername !== 'string') {
            setAddCourseResponse('Invalid teacher Username');
            return;
        }

        const teachername = course.teachername;
        if (typeof teachername !== 'string') {
            setAddCourseResponse('Invalid teacher Name');
            return;
        }
        const capacity = course.capacity;
        if (isNaN(capacity)) {
            setAddCourseResponse('Invalid course Capacity');
            return;
        }
        const response = await sendPostRequest(new TeacherAddCourseMessage(id, name, teacherusername, teachername, capacity));
        if (response.isError) {
            setAddCourseResponse(response.error);
            return;
        }
        setAddCourseResponse('Course added successfully')
    }

    const deleteCourse = async () => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setDeleteCourseResponse('Invalid course ID');
            return;
        }
        const name = course.coursename;
        if (typeof name !== 'string') {
            setDeleteCourseResponse('Invalid course Name');
            return;
        }
        const teacherusername = course.teacherusername;
        if (typeof teacherusername !== 'string') {
            setDeleteCourseResponse('Invalid teacher Username');
            return;
        }

        const teachername = course.teachername;
        if (typeof teachername !== 'string') {
            setDeleteCourseResponse('Invalid teacher Name');
            return;
        }
        const capacity = course.capacity;
        if (isNaN(capacity)) {
            setDeleteCourseResponse('Invalid course Capacity');
            return;
        }
        const response = await sendPostRequest(new TeacherDeleteCourseMessage(id, name, teacherusername, teachername, capacity));
        if (response.isError) {
            setDeleteCourseResponse(response.error);
            return;
        }
        setDeleteCourseResponse('Course deleted successfully')
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Course Management</h1>
            </header>
            <main className="App-main">
                <div className="course-details">
                    {errorMessage ? (
                        <p style={{ color: 'red' }}>{errorMessage}</p>
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
                                    <td>{JSON.stringify(course.coursehour)}</td>
                                </tr>
                                <tr>
                                    <th>Classroom ID:</th>
                                    <td>{course.classroomid}</td>
                                </tr>
                                <tr>
                                    <th>Enrolled Students:</th>
                                    <td>{JSON.stringify(course.enrolledstudents)}</td>
                                </tr>
                                </tbody>
                            </table>
                            {addCourseResponse && <p>{addCourseResponse}</p>}
                        </>
                    ) : (
                        <p>No course data available.</p>
                    )}
                    <div className="button-group">
                        <button onClick={() => addCourse()} className="button">
                            Add Course
                        </button>
                        <button onClick={() => deleteCourse()} className="button">
                            Delete Course
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