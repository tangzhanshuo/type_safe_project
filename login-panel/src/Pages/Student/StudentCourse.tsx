import React, { useEffect, useState } from 'react';
import { StudentCourseDetail } from 'Pages/Student/StudentCourseDetail';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory, Link, useParams } from 'react-router-dom'
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest'
import { StudentGetCourseListMessage } from 'Plugins/StudentAPI/StudentGetCourseListMessage'
import { logout } from 'Plugins/CommonUtils/UserManager'
import Auth from 'Plugins/CommonUtils/AuthState';
import 'Pages/css/Main.css';
import { StudentAddCourseMessage } from 'Plugins/StudentAPI/StudentAddCourseMessage' // Import the CSS file
import { StudentDeleteCourseMessage } from 'Plugins/StudentAPI/StudentDeleteCourseMessage'
import { StudentGetCourseMessage } from 'Plugins/StudentAPI/StudentGetCourseMessage'
import { StudentGetCourseByUsernameMessage } from 'Plugins/StudentAPI/StudentGetCourseByUsernameMessage'
import './App.css';
import {AdminAddStudent2CourseMessage} from "Plugins/AdminAPI/AdminAddStudent2CourseMessage"; // Ensure you have an App.css file in your src directory


export function StudentCourse() {
    const [studentCourseID, setStudentCourseID] = useState('');
    const [studentUsername, setStudentUsername] = useState('');
    const [studentPriority, setStudentPriority] = useState('');
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [addCourseResponse, setAddCourseResponse] = useState('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState('');
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [showAddResponse, setShowAddResponse] = useState(false);
    const [showDeleteResponse, setShowDeleteResponse] = useState(false);
    
    useEffect(() => {
        getCourseList();
        fetchSelectedCourses();
        setStudentUsername(Auth.getState().username);
    }, []);

    const fetchSelectedCourses = async () => {
        const response = await sendPostRequest(new StudentGetCourseByUsernameMessage(Auth.getState().username));
        if (response.isError) {
            setErrorMessage(response.error);
            setSelectedCourses([]);
            return;
        }
        try {
            const parsedCourses = JSON.parse(response.data);
            setSelectedCourses(parsedCourses);
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    }

    useEffect(() => {
        const { usertype, username, password } = Auth.getState();

        if (!usertype || !username || !password) {
            history.push('/login');
        }
        else if (usertype !== 'student') {
            history.push('/');
        }
    }, []);

    const addCourseWithId = async (courseid: string) => {
        const id = parseInt(courseid, 10);

        if (isNaN(id)) {
            setAddCourseResponse('Invalid course ID');
            return;
        }
        const response = await sendPostRequest(new StudentAddCourseMessage(
            id,
            //parseInt(studentPriority, 10)
            0
            )
        );

        if (response.isError) {
            setAddCourseResponse(response.error)
            return
        }
        setAddCourseResponse('Course '+id+' added successfully')
        setShowAddResponse(true);
        setTimeout(() => setShowAddResponse(false), 500);
        fetchSelectedCourses();
    }

    const deleteCourseWithId = async (courseid: string) => {
        const id = parseInt(courseid, 10);
        if (isNaN(id)) {
            setDeleteCourseResponse('Invalid course ID');
            return;
        }
        const response = await sendPostRequest(new StudentDeleteCourseMessage(id))
        if (response.isError) {
            setDeleteCourseResponse(response.error)
            return
        }
        setDeleteCourseResponse('Course '+id+' deleted successfully');
        setShowDeleteResponse(true);
        setTimeout(() => setShowDeleteResponse(false), 500); // Adjust time as needed
        fetchSelectedCourses();
    }

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
                    <header>
                        <h3> All courses </h3>
                    </header>

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
                                <th>Options</th>
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
                                    <td>
                                        {!selectedCourses.some(selectedCourse => selectedCourse.courseid === course.courseid) && (
                                            <button onClick={() => addCourseWithId(course.courseid)} className="button">
                                                Select
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No courses to display. Click 'Get Courses' to load the course list.</p>
                    )}
                    {errorMessage && errorMessage!='No courses found with student username: '+studentUsername && (<p style={{ color: 'red' }}>{errorMessage}</p>)}
                    {
                        <div className="response" style={{opacity: showAddResponse ? 1 : 0}}>
                            {addCourseResponse}
                        </div>
                    }

                    <button onClick={() => history.push('/student')} className="button">
                        Back to StudentMain
                    </button>
                    <button onClick={() => logout(history)} className="button">
                        Log out
                    </button>
                </div>
                <div>
                    <header>
                        <h3> Selected courses </h3>
                    </header>
                    {selectedCourses.length > 0 ? (
                        <table className="course-table">
                            <thead>
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Teacher</th>
                                <th>Capacity</th>
                                <th>Credits</th>
                                <th>Info</th>
                                <th>Options</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedCourses.map((course) => (
                                <tr key={course.courseid}>
                                    <td>{course.courseid}</td>
                                    <td>{course.coursename}</td>
                                    <td>{course.teachername}</td>
                                    <td>{course.capacity}</td>
                                    <td>{course.credits}</td>
                                    <td>{course.info}</td>
                                    <td>
                                        <button onClick={() => deleteCourseWithId(course.courseid)} className="button">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        ) : (
                        <p>No selected courses.</p>
                    )}
                    {
                        <div className="response" style={{opacity: showDeleteResponse ? 1 : 0}}>
                            {deleteCourseResponse}
                        </div>
                    }
                </div>

            </main>

        </div>

    )
        ;
}