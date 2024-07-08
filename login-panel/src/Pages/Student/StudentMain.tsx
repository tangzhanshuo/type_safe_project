import React, { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import { logout } from 'Plugins/CommonUtils/UserManager'
import Auth from 'Plugins/CommonUtils/AuthState';
import 'Pages/css/Main.css'; // Import the CSS file

export function StudentMain() {
    const history = useHistory();

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

    return (
        <div className="App">
            <header className="App-header">
                <h1>StudentMain</h1>
            </header>
            <main className="App-main">
                <div className="button-group">
                    <button onClick={() => history.push('/student/course')} className="button">
                        Go to courses
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
