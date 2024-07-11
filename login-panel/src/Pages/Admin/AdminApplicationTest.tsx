import React, { useEffect, useState } from 'react'
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css';
import Auth from 'Plugins/CommonUtils/AuthState'
import { logout } from 'Plugins/CommonUtils/UserManager'
import { AdminDeleteApplicationMessage } from 'Plugins/AdminAPI/AdminDeleteApplicationMessage'
import { AdminGetApplicationFromApproverMessage } from 'Plugins/AdminAPI/AdminGetApplicationFromApproverMessage'
import { AdminApproveApplicationMessage } from 'Plugins/AdminAPI/AdminApproveApplicationMessage'
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest'

interface Approver {
    approved: boolean;
    username: string;
    usertype: 'admin' | 'teacher' | 'student';
}

interface Application {
    applicationid: string;
    usertype: string;
    username: string;
    applicationtype: string;
    info: string;
    approver: string;
}

export function AdminApplicationTest() {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const { usertype, username, password } = Auth.getState();
        if (!usertype || !username || !password) {
            history.push('/login');
        }
        else if (usertype !== 'admin') {
            history.push('/');
        }
    }, [history]);

    const handleDelete = async (applicationId: string) => {
        const message = new AdminDeleteApplicationMessage(applicationId);

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage('Application deleted successfully');
            setErrorMessage('');
            handleGetFromApprover(); // Refresh the applications list
        } else {
            setErrorMessage(response.error || 'Failed to delete application');
            setSuccessMessage('');
        }
    };

    const handleGetFromApprover = async () => {
        const message = new AdminGetApplicationFromApproverMessage();

        const response = await sendPostRequest(message);
        if (!response.isError) {
            // Sort applications by applicationid
            const sortedApplications = response.data.sort((a: Application, b: Application) =>
                a.applicationid.localeCompare(b.applicationid)
            );
            setApplications(sortedApplications);
            setSuccessMessage('Applications retrieved successfully');
            setErrorMessage('');
        } else {
            setApplications([]); // Clear the applications table for any error
            if (response.error === 'No application found') {
                setSuccessMessage('No applications found');
                setErrorMessage('');
            } else {
                setErrorMessage(response.error || 'Failed to retrieve applications');
                setSuccessMessage('');
            }
        }
    };

    const handleApprove = async (applicationId: string) => {
        const message = new AdminApproveApplicationMessage(applicationId);

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage('Application approved successfully');
            setErrorMessage('');
            handleGetFromApprover(); // Refresh the applications list
        } else {
            setErrorMessage(response.error || 'Failed to approve application');
            setSuccessMessage('');
        }
    };

    const parseApprovers = (approverString: string): Approver[] => {
        try {
            return JSON.parse(approverString);
        } catch (error) {
            console.error('Error parsing approver data:', error);
            return [];
        }
    };

    const renderApproverCell = (approver: Approver | undefined) => {
        if (!approver) return <td></td>;
        return (
            <td>
                {approver.usertype}: {approver.username}
                <br />
                Approved: {approver.approved ? 'Yes' : 'No'}
            </td>
        );
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>AdminApplicationTest</h1>
            </header>
            <main className="App-main">
                {errorMessage && <div className="error-message" style={{color: 'red'}}>{errorMessage}</div>}
                {successMessage && <div className="success-message" style={{color: 'green'}}>{successMessage}</div>}
                <div className="button-group">
                    <button onClick={handleGetFromApprover} className="button">Get Applications</button>
                    <button onClick={() => logout(history)} className="button">Log out</button>
                </div>

                {applications.length > 0 && (
                    <div className="applications-table">
                        <h2>Applications</h2>
                        <table>
                            <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>User Type</th>
                                <th>Username</th>
                                <th>Application Type</th>
                                <th>Info</th>
                                <th>Approver 1</th>
                                <th>Approver 2</th>
                                <th>Approver 3</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {applications.map((app) => {
                                const approvers = parseApprovers(app.approver);
                                return (
                                    <tr key={app.applicationid}>
                                        <td>{app.applicationid}</td>
                                        <td>{app.usertype}</td>
                                        <td>{app.username}</td>
                                        <td>{app.applicationtype}</td>
                                        <td>{app.info}</td>
                                        {renderApproverCell(approvers[0])}
                                        {renderApproverCell(approvers[1])}
                                        {renderApproverCell(approvers[2])}
                                        <td>
                                            <button onClick={() => handleApprove(app.applicationid)} className="approve-button">
                                                Approve
                                            </button>
                                            <button onClick={() => handleDelete(app.applicationid)} className="delete-button">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}