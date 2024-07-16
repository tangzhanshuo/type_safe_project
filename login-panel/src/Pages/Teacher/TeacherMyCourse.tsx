import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherGetCourseListMessage } from 'Plugins/TeacherAPI/TeacherGetCourseListMessage';
import { TeacherDeleteCourseMessage } from 'Plugins/TeacherAPI/TeacherDeleteCourseMessage';
import 'Pages/css/Main.css';
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';

interface Course {
    courseid: number;
    courseName: string;
    capacity: number;
    credits: number;
    info: string;
    courseHour: string;
    classroomid: number;
    enrolledStudents: string;
}

export function TeacherMyCourse(): JSX.Element {
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
            const parsedCourses: Course[] = response.data;
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
        <TeacherLayout>
            <div className="App">
                <main className="App-main bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="course-list dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        {errorMessage ? (
                            <p style={{color: 'red'}}>{errorMessage}</p>
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
                                        <td>{course.courseName}</td>
                                        <td>{course.capacity}</td>
                                        <td>{course.credits}</td>
                                        <td>{course.info}</td>
                                        <td>{course.courseHour}</td>
                                        <td>{course.classroomid}</td>
                                        <td>{course.enrolledStudents}</td>
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
                            <button onClick={getCourses}
                                    style={{marginTop: '30px'}}
                                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105">
                                Refresh Courses
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </TeacherLayout>
    );
}