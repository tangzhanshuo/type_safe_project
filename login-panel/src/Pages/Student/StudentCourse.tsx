import React, { useEffect, useState } from 'react';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory, Link } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest'
import { StudentGetCourseListMessage } from 'Plugins/StudentAPI/StudentGetCourseListMessage'
import { logout } from 'Plugins/CommonUtils/UserManager'
import Auth from 'Plugins/CommonUtils/AuthState';
import 'Pages/css/Main.css'; // Import the CSS file

export function StudentCourse() {
    const history = useHistory();
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const { usertype, username, password } = Auth.getState();

        if (!usertype || !username || !password) {
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
                        <table className="course-table">
                            <thead>
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Teacher</th>
                                <th>Capacity</th>
                                <th>Credits</th>
                                <th>Info</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courses.map((course) => (
                                <tr key={course.courseid}>
                                    <td>
                                        <Link to={`/student/course/${course.courseid}`}>
                                            {course.courseid}
                                        </Link>
                                    </td>
                                    <td>{course.coursename}</td>
                                    <td>{course.teachername}</td>
                                    <td>{course.capacity}</td>
                                    <td>{course.credits}</td>
                                    <td>{course.info}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
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