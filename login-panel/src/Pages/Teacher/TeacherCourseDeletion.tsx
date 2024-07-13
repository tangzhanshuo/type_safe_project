import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherDeleteCourseMessage } from 'Plugins/TeacherAPI/TeacherDeleteCourseMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import 'Pages/css/Main.css';

export function TeacherCourseDeletion() {
    const history = useHistory();
    const [courseID, setCourseID] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [addCourseResponse, setAddCourseResponse] = useState('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState('');
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            history.push('/login');
        } else if (usertype !== 'teacher') {
            history.push('/');
        }
    }, [history]);

    const deleteCourse = async () => {
        if (courseID === null) {
            setDeleteCourseResponse('Please enter course ID.');
            return;
        }

        if (typeof courseID !== 'number') {
            setDeleteCourseResponse('Invalid course ID');
            return;
        }

        const response = await sendPostRequest(new TeacherDeleteCourseMessage(courseID));
        if (response.isError) {
            setDeleteCourseResponse(response.error);
            return;
        }
        setDeleteCourseResponse('Course deleted successfully')
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Delete Course</h1>
            </header>
            <main className="App-main">
                <div className="form-group">
                    <div className="form-row">
                        <label htmlFor="courseID" className="label-above">
                            Course ID
                        </label>
                        <input id="courseID" type="number" value={courseID}
                               onChange={(e) => setCourseID(parseInt(e.target.value, 10))}
                               placeholder="Enter Course ID" className="input-field" />
                    </div>
                </div>
                <div className="button-group">
                    <button onClick={deleteCourse} className="button">
                        Delete Course
                    </button>
                    <button onClick={() => history.push('/teacher/coursedetail')} className="button">
                        View Course Details
                    </button>
                    <button onClick={() => history.push('/teacher/coursemanage')} className="button">
                        Back To CourseManagement
                    </button>
                    <button onClick={() => history.push('/teacher')} className="button">
                        Back to TeacherMain
                    </button>
                    <button onClick={() => logout(history)} className="button">
                        Log out
                    </button>
                </div>
                {deleteCourseResponse && <p>{deleteCourseResponse}</p>}
            </main>
        </div>
    );
}