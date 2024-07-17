import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css';
import Auth from 'Plugins/CommonUtils/AuthState'
import { logout } from 'Plugins/CommonUtils/UserManager'
import { AdminDeleteApplicationMessage } from 'Plugins/AdminAPI/AdminDeleteApplicationMessage'
import { AdminGetApplicationFromApproverMessage } from 'Plugins/AdminAPI/AdminGetApplicationFromApproverMessage'
import { AdminApproveApplicationMessage } from 'Plugins/AdminAPI/AdminApproveApplicationMessage'
import { AdminRejectApplicationMessage } from 'Plugins/AdminAPI/AdminRejectApplicationMessage'
import { sendPostRequest, sendApplicationListRequest, Application, Approver } from 'Plugins/CommonUtils/SendPostRequest'

export function AdminApplication() {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const { usertype, username, token } = Auth.getState();
        if (!usertype || !username || !token) {
            history.push('/login');
        }
        else if (usertype !== 'admin') {
            history.push('/');
        }
    }, [history]);

    const handleDelete = async (applicationID: string) => {
        const message = new AdminDeleteApplicationMessage(applicationID);

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

        const response = await sendApplicationListRequest(message);
        if (!response.isError) {
            // Sort applications by applicationID
            const sortedApplications = response.data.sort((a: Application, b: Application) =>
                a.applicationID.localeCompare(b.applicationID)
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

    const handleApprove = async (applicationID: string) => {
        const message = new AdminApproveApplicationMessage(applicationID);

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

    const handleReject = async (applicationID: string) => {
        const message = new AdminRejectApplicationMessage(applicationID);

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage('Application rejected successfully');
            setErrorMessage('');
            handleGetFromApprover(); // Refresh the applications list
        } else {
            setErrorMessage(response.error || 'Failed to reject application');
            setSuccessMessage('');
        }
    };

    const renderApproverCell = (approver: Approver | undefined) => {
        if (!approver) return <td>No approver</td>;
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
                                <th>Status</th>
                                <th>Approver 1</th>
                                <th>Approver 2</th>
                                <th>Approver 3</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {applications.map((app) => (
                                <tr key={app.applicationID}>
                                    <td>{app.applicationID}</td>
                                    <td>{app.usertype}</td>
                                    <td>{app.username}</td>
                                    <td>{app.applicationType}</td>
                                    <td>{app.info}</td>
                                    <td>{app.status}</td>
                                    {renderApproverCell(app.approver[0])}
                                    {renderApproverCell(app.approver[1])}
                                    {renderApproverCell(app.approver[2])}
                                    <td>
                                        <button onClick={() => handleApprove(app.applicationID)} className="approve-button">
                                            Approve
                                        </button>
                                        <button onClick={() => handleReject(app.applicationID)} className="reject-button">
                                            Reject
                                        </button>
                                        <button onClick={() => handleDelete(app.applicationID)} className="delete-button">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}