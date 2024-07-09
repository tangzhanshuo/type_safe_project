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
    const [course, setCourse] = useState('');
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
        try {
            const response = await sendPostRequest(new StudentGetCourseListMessage())
            if (response.isError) {
                setErrorMessage(response.error)
                return
            }
            setCourse(response.data)

        } catch (error) {
            if (isAxiosError(error)) {
                alert(error.response?.data);
            } else {
                alert(error);
            }
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>StudentMain</h1>
            </header>
            <main className="App-main">
                <div className="button-group">
                    <p>{course}</p>
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
