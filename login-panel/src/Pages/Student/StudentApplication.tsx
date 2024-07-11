import React, { useEffect, useState } from 'react';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css';
import Auth from 'Plugins/CommonUtils/AuthState';
import { logout } from 'Plugins/CommonUtils/UserManager';
import { StudentAddApplicationMessage } from 'Plugins/StudentAPI/StudentAddApplicationMessage';
import { StudentGetApplicationFromApplicantMessage } from 'Plugins/StudentAPI/StudentGetApplicationFromApplicantMessage';
import { StudentDeleteApplicationMessage } from 'Plugins/StudentAPI/StudentDeleteApplicationMessage';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';

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

export function StudentApplication() {
    const history = useHistory();
    const [applicationType, setApplicationType] = useState('');
    const [info, setInfo] = useState('');
    const [approvers, setApprovers] = useState<Approver[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const { usertype, username, password } = Auth.getState();
        if (!usertype || !username || !password) {
            history.push('/login');
        }
        else if (usertype !== 'student') {
            history.push('/');
        }
    }, [history]);

    const addApprover = () => {
        setApprovers([...approvers, { approved: false, username: '', usertype: 'admin' }]);
    };

    const removeApprover = (index: number) => {
        setApprovers(approvers.filter((_, i) => i !== index));
    };

    const updateApprover = (index: number, field: 'username' | 'usertype', value: string) => {
        const newApprovers = [...approvers];
        newApprovers[index] = { ...newApprovers[index], [field]: value as any };
        setApprovers(newApprovers);
    };

    const handleAdd = async () => {
        if (!applicationType.trim() || !info.trim() || approvers.length === 0) {
            setErrorMessage('Application Type, Info, and at least one Approver are required.');
            setSuccessMessage('');
            return;
        }

        const message = new StudentAddApplicationMessage(applicationType, info, JSON.stringify(approvers));

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage('Application added successfully');
            setErrorMessage('');
            setApplicationType('');
            setInfo('');
            setApprovers([]);
            handleGetFromApplicant(); // Refresh the applications list
        } else {
            setErrorMessage(response.error || 'Failed to add application');
            setSuccessMessage('');
        }
    };

    const handleGetFromApplicant = async () => {
        const message = new StudentGetApplicationFromApplicantMessage();

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

    const handleDelete = async (applicationId: string) => {
        const message = new StudentDeleteApplicationMessage(applicationId);

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage('Application deleted successfully');
            setErrorMessage('');
            handleGetFromApplicant(); // Refresh the applications list
        } else {
            setErrorMessage(response.error || 'Failed to delete application');
            setSuccessMessage('');
            handleGetFromApplicant(); // Refresh the applications list even on error
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
                <h1>StudentApplication</h1>
            </header>
            <main className="App-main">
                <div className="input-group">
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
                </div>
                <div className="approvers-section">
                    <h2>Approvers</h2>
                    {approvers.map((approver, index) => (
                        <div key={index} className="approver-input">
                            <select
                                value={approver.usertype}
                                onChange={(e) => updateApprover(index, 'usertype', e.target.value)}
                            >
                                <option value="admin">Admin</option>
                                <option value="teacher">Teacher</option>
                                <option value="student">Student</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Username"
                                value={approver.username}
                                onChange={(e) => updateApprover(index, 'username', e.target.value)}
                            />
                            <button onClick={() => removeApprover(index)}>Remove</button>
                        </div>
                    ))}
                    <button onClick={addApprover}>Add Approver</button>
                </div>

                {errorMessage && <div className="error-message" style={{color: 'red'}}>{errorMessage}</div>}
                {successMessage && <div className="success-message" style={{color: 'green'}}>{successMessage}</div>}

                <div className="button-group">
                    <button onClick={handleAdd} className="button">Add Application</button>
                    <button onClick={handleGetFromApplicant} className="button">Get My Applications</button>
                    <button onClick={() => history.push('/student')} className="button">
                        Back to StudentMain
                    </button>
                    <button onClick={() => logout(history)} className="button">Log out</button>
                </div>

                {applications.length > 0 && (
                    <div className="applications-table">
                        <h2>My Applications</h2>
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
                                <th>Action</th>
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