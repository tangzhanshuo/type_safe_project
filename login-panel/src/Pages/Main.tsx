import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css';
import { sendUserRequest } from 'Plugins/CommonUtils/UserManager'
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';

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
                </div>
            </main>
        </div>
    );
}
