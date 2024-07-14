import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherGetCourseListMessage } from 'Plugins/TeacherAPI/TeacherGetCourseListMessage';
import { TeacherDeleteCourseMessage } from 'Plugins/TeacherAPI/TeacherDeleteCourseMessage';
import 'Pages/css/Main.css';

interface Course {
    courseid: number;
    coursename: string;
    capacity: number;
    credits: number;
    info: string;
    coursehour: string;
    classroomid: number;
    enrolledstudents: string;
}

export function TeacherCourse(): JSX.Element {
    const history = useHistory();
    const [courses, setCourses] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            history.push('/login');
        } else if (usertype !== 'teacher') {
            history.push('/');
        } else {
            getCourses();
        }
    }, [history]);

    const getCourses = async (): Promise<void> => {
        setIsLoading(true);
        const response = await sendPostRequest(new TeacherGetCourseListMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            setIsLoading(false);
            return;
        }
        try {
            const parsedCourses: Course[] = JSON.parse(response.data);
            setCourses(parsedCourses);
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
        setIsLoading(false);
    }

    const deleteCourse = async (courseid: number): Promise<void> => {
        const response = await sendPostRequest(new TeacherDeleteCourseMessage(courseid));
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }
        // Refresh the course list after successful deletion
        getCourses();
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Teacher Course Management</h1>
            </header>
            <main className="App-main">
                <div className="course-list">
                    {errorMessage ? (
                        <p style={{ color: 'red' }}>{errorMessage}</p>
                    ) : isLoading ? (
                        <p>Loading courses...</p>
                    ) : courses.length > 0 ? (
                        <table className="details-table">
                            <thead>
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Capacity</th>
                                <th>Credits</th>
                                <th>Info</th>
                                <th>Course Hours</th>
                                <th>Classroom ID</th>
                                <th>Enrolled Students</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courses.map(course => (
                                <tr key={course.courseid}>
                                    <td>
                                        <Link to={`/teacher/course/${course.courseid}`}>
                                            {course.courseid}
                                        </Link>
                                    </td>
                                    <td>{course.coursename}</td>
                                    <td>{course.capacity}</td>
                                    <td>{course.credits}</td>
                                    <td>{course.info}</td>
                                    <td>{course.coursehour}</td>
                                    <td>{course.classroomid}</td>
                                    <td>{course.enrolledstudents}</td>
                                    <td>
                                        <button
                                            onClick={() => deleteCourse(course.courseid)}
                                            className="button delete-button"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No courses available.</p>
                    )}
                    <div className="button-group">
                        <button onClick={() => history.push('/teacher/course/add')} className="button">
                            Add Course
                        </button>
                        <button onClick={getCourses} className="button">
                            Refresh Courses
                        </button>
                        <button onClick={() => history.push('/teacher')} className="button">
                            Back to TeacherMain
                        </button>
                        <button onClick={() => history.push('/')} className="button">
                            Back to Main
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