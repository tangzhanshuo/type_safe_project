import React, { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest'
import { StudentGetCourseListMessage } from 'Plugins/StudentAPI/StudentGetCourseListMessage'
import { logout } from 'Plugins/CommonUtils/UserManager'
import Auth from 'Plugins/CommonUtils/AuthState';
import 'Pages/css/Main.css'; // Import the CSS file

export function StudentCourse() {
    const history = useHistory();
    const [courseList, setCourseList] = useState([]);
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Assuming username and password are stored in localStorage
        const { usertype, username, password } = Auth.getState();

        if (!usertype || !username || !password) {
            // Redirect to login page
            history.push('/login');
        }
        else if (usertype !== 'student') {
            history.push('/');
        }
    }, []);

    const getCourseList = async () => {
        const response = await sendPostRequest(new StudentGetCourseListMessage())
        if (response.isError) {
            setErrorMessage(response.error)
            return
        }
        try {
            const parsedCourses = JSON.parse(response.data);
            setCourses(parsedCourses);
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>StudentMain</h1>
            </header>
            <main className="App-main">
                <div className="button-group">
                    {courses.length > 0 ? (
                        <ul className="course-list">
                            {courses.map((course) => (
                                <li key={course.courseid} className="course-item">
                                    <h3>{course.coursename}</h3>
                                    <p>Teacher: {course.teachername}</p>
                                    <p>Course ID: {course.courseid}</p>
                                    <p>Capacity: {course.capacity}</p>
                                    <p>Credits: {course.credits}</p>
                                    <p>Info: {course.info}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No courses to display. Click 'Get Courses' to load the course list.</p>
                    )}
                    <p style={{ color: 'red' }}>{errorMessage}</p>
                    <button onClick={() => getCourseList()} className="button">
                        Get Courses
                    </button>
                    <button onClick={() => history.push('/student')} className="button">
                        Back to StudentMain
                    </button>
                    <button onClick={() => logout(history)} className="button">
                        Log out
                    </button>
                </div>
            </main>
        </div>
    );
}