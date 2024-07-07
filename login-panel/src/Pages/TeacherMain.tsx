import React, { useEffect, useState } from 'react'
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css';
import Auth from 'Plugins/CommonUtils/AuthState' // Import the CSS file

export function TeacherMain() {
    const history = useHistory();

    useEffect(() => {
        // Assuming username and password are stored in localStorage
        const { usertype, username, password } = Auth.getState();

        if (!usertype || !username || !password) {
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
                    <button onClick={() => history.push('/')} className="button">
                        Log out
                    </button>
                </div>
            </main>
        </div>
    );
}
