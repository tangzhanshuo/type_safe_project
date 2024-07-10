import React, { useEffect, useState } from 'react';
import { API } from 'Plugins/CommonUtils/API';
import { useHistory } from 'react-router-dom';
import 'Pages/css/Main.css';
import Auth from 'Plugins/CommonUtils/AuthState';
import { logout } from 'Plugins/CommonUtils/UserManager';
import { StudentAddApplicationMessage } from 'Plugins/StudentAPI/StudentAddApplicationMessage';
import { StudentGetApplicationFromApplicantMessage } from 'Plugins/StudentAPI/StudentGetApplicationFromApplicantMessage';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';

interface Approver {
    approved: boolean;
    username: string;
    usertype: 'admin' | 'teacher' | 'student';
}

export function StudentApplication() {
    const history = useHistory();
    const [applicationID, setApplicationID] = useState('');
    const [applicationType, setApplicationType] = useState('');
    const [info, setInfo] = useState('');
    const [approvers, setApprovers] = useState<Approver[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const { usertype, username, password } = Auth.getState();
        if (!usertype || !username || !password) {
            history.push('/login');
        }
        else if (usertype !== 'student') {
            history.push('/');
        }
    }, []);

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
            setSuccessMessage(JSON.stringify(response.data));
            setErrorMessage('');
            setApplicationType('');
            setInfo('');
            setApprovers([]);
        } else {
            setErrorMessage(response.error || 'Failed to add application');
            setSuccessMessage('');
        }
    };

    const handleGetFromApplicant = async () => {
        const message = new StudentGetApplicationFromApplicantMessage();

        const response = await sendPostRequest(message);
        if (!response.isError) {
            setSuccessMessage(JSON.stringify(response.data));
            setErrorMessage('');
        } else {
            setErrorMessage(response.error || 'Failed to retrieve applications');
            setSuccessMessage('');
        }
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
            </main>
        </div>
    );
}