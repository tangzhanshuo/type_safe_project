import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import './css/Main.css'; // Import the CSS file

export function TeacherMain() {
    const history = useHistory();

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
