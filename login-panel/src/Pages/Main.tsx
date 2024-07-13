import React, { useEffect, useState } from 'react'
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css';
import { sendUserRequest } from 'Plugins/CommonUtils/UserManager'
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import Auth from 'Plugins/CommonUtils/AuthState'

export function Main() {
    const history = useHistory();

    return (
        <div className="App">
            <header className="App-header">
                <h1>Main</h1>
            </header>
            <main className="App-main">
                <div className="button-group">
                    <button onClick={() => history.push('/login')} className="button">
                        Login
                    </button>
                    <button onClick={() => history.push('/student')} className="button">
                        Student
                    </button>
                    <button onClick={() => history.push('/teacher')} className="button">
                        Teacher
                    </button>
                    <button onClick={() => history.push('/admin')} className="button">
                        Admin
                    </button>
                    <button onClick={() => {
                        sendUserRequest("register","admin","a","a")
                        sendUserRequest("register","teacher","a","a")
                        sendUserRequest("register","student","a","a")
                    }} className="button">
                        Register test accounts
                    </button>
                </div>
            </main>
        </div>
    );
}
