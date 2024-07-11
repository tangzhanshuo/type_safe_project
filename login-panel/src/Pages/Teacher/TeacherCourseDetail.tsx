import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';

export function TeacherCourseDetail() {
    const history = useHistory();

    useEffect(() => {
        const { usertype } = Auth.getState();
        if (usertype !== 'teacher') {
            history.push('/login');
        }
    }, [history]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Teacher Course Management</h1>
            </header>
            <main className="App-main">
                <div className="button-group">
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
            </main>
        </div>
    );
}