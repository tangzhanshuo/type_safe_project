import React, { useEffect, useState } from 'react'
import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css';
import Auth from 'Plugins/CommonUtils/AuthState'
import { logout } from 'Plugins/CommonUtils/UserManager'
import { AdminAddApplicationMessage } from 'Plugins/AdminAPI/AdminAddApplicationMessage'
import { AdminDeleteApplicationMessage } from 'Plugins/AdminAPI/AdminDeleteApplicationMessage'
import { AdminGetApplicationFromIDMessage } from 'Plugins/AdminAPI/AdminGetApplicationFromIDMessage'
import { AdminGetApplicationFromApplicantMessage } from 'Plugins/AdminAPI/AdminGetApplicationFromApplicantMessage'
import { AdminGetApplicationFromApproverMessage } from 'Plugins/AdminAPI/AdminGetApplicationFromApproverMessage'
import { AdminApproveApplicationMessage } from 'Plugins/AdminAPI/AdminApproveApplicationMessage'
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest'

export function AdminApplicationTest() {
    const history = useHistory();
    const [applicationID, setApplicationID] = useState('');
    const [applicationType, setApplicationType] = useState('');
    const [info, setInfo] = useState('');
    const [approver, setApprover] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const { usertype, username, password } = Auth.getState();
        if (!usertype || !username || !password) {
            history.push('/login');
        }
        else if (usertype !== 'admin') {
            history.push('/');
        }
    }, []);

    const handleAdd = async () => {
        if (!applicationType.trim() || !info.trim() || !approver.trim()) {
            setErrorMessage('Application Type, Info, and Approver are required fields.');
            setSuccessMessage('');
            return;
        }

        const message = new AdminAddApplicationMessage(applicationType, info, approver);

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage(JSON.stringify(response.data));
            setErrorMessage('');
            setApplicationType('');
            setInfo('');
            setApprover('');
        } else {
            setErrorMessage(response.error || 'Failed to add application');
            setSuccessMessage('');
        }
    };

    const handleDelete = async () => {
        if (!applicationID.trim()) {
            setErrorMessage('Application ID is required');
            return;
        }

        const message = new AdminDeleteApplicationMessage(applicationID);

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage(JSON.stringify(response.data));
            setErrorMessage('');
            setApplicationID('');
        } else {
            setErrorMessage(response.error || 'Failed to delete application');
            setSuccessMessage('');
        }
    };

    const handleGetFromID = async () => {
        if (!applicationID.trim()) {
            setErrorMessage('Application ID is required');
            return;
        }

        const message = new AdminGetApplicationFromIDMessage(applicationID);

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage(JSON.stringify(response.data));
            setErrorMessage('');
        } else {
            setErrorMessage(response.error || 'Failed to retrieve application');
            setSuccessMessage('');
        }
    };

    const handleGetFromApplicant = async () => {
        const message = new AdminGetApplicationFromApplicantMessage();

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage(JSON.stringify(response.data));
            setErrorMessage('');
        } else {
            setErrorMessage(response.error || 'Failed to retrieve applications');
            setSuccessMessage('');
        }
    };

    const handleGetFromApprover = async () => {
        const message = new AdminGetApplicationFromApproverMessage();

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage(JSON.stringify(response.data));
            setErrorMessage('');
        } else {
            setErrorMessage(response.error || 'Failed to retrieve applications');
            setSuccessMessage('');
        }
    };

    const handleApprove = async () => {
        if (!applicationID.trim()) {
            setErrorMessage('Application ID is required');
            return;
        }

        const message = new AdminApproveApplicationMessage(applicationID);

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage(JSON.stringify(response.data));
            setErrorMessage('');
        } else {
            setErrorMessage(response.error || 'Failed to approve application');
            setSuccessMessage('');
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>AdminApplicationTest</h1>
            </header>
            <main className="App-main">
                <div className="input-group">
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Application ID"
                            value={applicationID}
                            onChange={(e) => setApplicationID(e.target.value)}
                            className="input-field"
                        />
                        <label>Application ID</label>
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Application Type"
                            value={applicationType}
                            onChange={(e) => setApplicationType(e.target.value)}
                            className="input-field"
                        />
                        <label>Application Type</label>
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Info"
                            value={info}
                            onChange={(e) => setInfo(e.target.value)}
                            className="input-field"
                        />
                        <label>Info</label>
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Approver"
                            value={approver}
                            onChange={(e) => setApprover(e.target.value)}
                            className="input-field"
                        />
                        <label>Approver</label>
                    </div>
                </div>
                {errorMessage && <div className="error-message" style={{color: 'red'}}>{errorMessage}</div>}
                {successMessage && <div className="success-message" style={{color: 'green'}}>{successMessage}</div>}
                <div className="button-group">
                    <button onClick={handleAdd} className="button">Add</button>
                    <button onClick={handleDelete} className="button">Delete</button>
                    <button onClick={handleGetFromID} className="button">Get from ID</button>
                    <button onClick={handleGetFromApplicant} className="button">Get from Applicant</button>
                    <button onClick={handleGetFromApprover} className="button">Get from Approver</button>
                    <button onClick={handleApprove} className="button">Approve</button>
                    <button onClick={() => logout(history)} className="button">Log out</button>
                </div>
            </main>
        </div>
    );
}