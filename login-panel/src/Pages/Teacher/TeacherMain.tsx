import React, { useEffect, useState } from 'react'
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import { logout } from 'Plugins/CommonUtils/UserManager'
import 'Pages/css/Main.css';
import Auth from 'Plugins/CommonUtils/AuthState' // Import the CSS file

export function TeacherMain() {
    const history = useHistory();

    useEffect(() => {
        // Assuming username and password are stored in localStorage
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            // Redirect to login page
            history.push('/login');
        }
        else if (usertype !== 'teacher') {
            history.push('/');
        }
    }, []);

    return (
    <div className="App">
        <header className="App-header">
            <h1>TeacherMain</h1>
        </header>
        <main className="App-main">
            <div className="button-group">
                <button onClick={() => history.push('/teacher/coursemanage')} className="button">
                    Course Management
                </button>
                <button onClick={() => history.push('/teacher/coursedetail')} className="button">
                    Course Details
                </button>
                <button onClick={() => history.push('/')} className="button">
                    Back to Main
                </button>
                <button onClick={() => logout(history)} className="button">
                    Log out
                </button>
            </div>
        </main>
    </div>
    );
}