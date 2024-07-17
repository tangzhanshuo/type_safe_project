import React, { useEffect, useState } from 'react'
import { API } from 'Plugins/CommonUtils/API';
import { useHistory, Link } from 'react-router-dom';
import Auth from 'Plugins/CommonUtils/AuthState'
import { logout } from 'Plugins/CommonUtils/UserManager'
import { AdminDeleteApplicationMessage } from 'Plugins/AdminAPI/AdminDeleteApplicationMessage'
import { AdminGetApplicationFromApproverMessage } from 'Plugins/AdminAPI/AdminGetApplicationFromApproverMessage'
import { AdminApproveApplicationMessage } from 'Plugins/AdminAPI/AdminApproveApplicationMessage'
import { AdminRejectApplicationMessage } from 'Plugins/AdminAPI/AdminRejectApplicationMessage'
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { sendPostRequest, sendApplicationListRequest, Application, Approver } from 'Plugins/CommonUtils/SendPostRequest'
import { FaSync, FaPlus, FaMinus } from "react-icons/fa";

export function AdminApplication() {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [applications, setApplications] = useState<Application[]>([]);
    const [expandedStates, setExpandedStates] = useState<{ [key: string]: boolean }>({});
    useEffect(() => {
        handleGetFromApprover();
        const { usertype, username, token } = Auth.getState();
        if (!usertype || !username || !token) {
            history.push('/login');
        }
        else if (usertype !== 'admin') {
            history.push('/');
        }
    }, [history]);

    const toggleExpand = (applicationID: string) => {
        // Toggle the expansion state for the given application ID
        setExpandedStates(prevState => ({
            ...prevState,
            [applicationID]: !prevState[applicationID]
        }));
    };

    const handleDelete = async (applicationID: string) => {
        const message = new AdminDeleteApplicationMessage(applicationID);

        const response = await sendApplicationListRequest(message);
        if (!response.isError) {
            setSuccessMessage('Application deleted successfully');
            setErrorMessage('');
            handleGetFromApprover();
        } else {
            setErrorMessage(response.error || 'Failed to delete application');
            setSuccessMessage('');
        }
    };

    const handleGetFromApprover = async () => {
        const message = new AdminGetApplicationFromApproverMessage();

        const response = await sendPostRequest(message);
        if (!response.isError) {
            const sortedApplications = response.data.sort((a: Application, b: Application) =>
                a.applicationID.localeCompare(b.applicationID)
            );
            setApplications(sortedApplications);
            setSuccessMessage('Applications retrieved successfully');
            setErrorMessage('');
        } else {
            setApplications([]);
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
            handleGetFromApprover();
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
            handleGetFromApprover();
        } else {
            setErrorMessage(response.error || 'Failed to reject application');
            setSuccessMessage('');
        }
    };

    const renderApproverCell = (approver: Approver | undefined) => {
        if (!approver) return <td className="px-6 py-4 whitespace-nowrap">No approver</td>;
        return (
            <td className="px-6 py-4 whitespace-nowrap">
                <div>{approver.usertype}: {approver.username}</div>
                <div>Approved: {approver.approved ? 'Yes' : 'No'}</div>
            </td>
        );
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-4">
                        {errorMessage && <div className="text-red-500 dark:text-red-400">{errorMessage}</div>}
                        {successMessage && <div className="text-green-500 dark:text-green-400">{successMessage}</div>}
                        <button
                            onClick={handleGetFromApprover}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded transition duration-300 hover:scale-105"
                            title="Refresh information"
                        >
                            <FaSync />
                        </button>
                    </div>

                    {applications.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Applications</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User
                                            Type
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Application
                                            Type
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Info
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {applications.map((app) => (
                                        <tr key={app.applicationID}>
                                            <td className="px-6 py-4 whitespace-nowrap">{app.usertype}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{app.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{app.applicationType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {!expandedStates[app.applicationID] ? (
                                                    <button className="text-green-500 hover:text-green-600"
                                                            onClick={() => toggleExpand(app.applicationID)}
                                                            style={{display: 'inline-block', cursor: 'pointer'}}>
                                                        <FaPlus/> {/* Use an actual icon component */}
                                                    </button>
                                                ) : (
                                                    <div>
                                                        <button className="text-red-500 hover:text-red-600"
                                                                onClick={() => toggleExpand(app.applicationID)} style={{
                                                            display: 'inline-block',
                                                            cursor: 'pointer',
                                                            marginTop: '5px'
                                                        }}>
                                                            <FaMinus/>{/* Use an actual icon component */}
                                                        </button>
                                                        {(() => {
                                                            const infoObj = JSON.parse(app.info);
                                                            const propertiesToShow = ['courseID', 'info', 'credits', 'capacity', 'courseHour', 'courseName', 'classroomID', 'teacherName'];
                                                            return propertiesToShow.map((prop, index) => (
                                                                infoObj[prop] ?
                                                                    <div key={index} style={{marginBottom: '5px'}}>
                                                                        <strong>{prop}:</strong> {infoObj[prop]}
                                                                    </div> : null
                                                            ));
                                                        })()}
                                                        <div style={{marginBottom: '5px'}}>
                                                            <strong>Approver
                                                                1:</strong> {renderApproverCell(app.approver[0])}
                                                            <strong>Approver
                                                                2:</strong> {renderApproverCell(app.approver[1])}
                                                            <strong>Approver
                                                                3:</strong> {renderApproverCell(app.approver[2])}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{app.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => handleApprove(app.applicationID)}
                                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-2">Approve
                                                </button>
                                                <button onClick={() => handleReject(app.applicationID)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-2">Reject
                                                </button>
                                                <button onClick={() => handleDelete(app.applicationID)}
                                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </AdminLayout>
    );
}