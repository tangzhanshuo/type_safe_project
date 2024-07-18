import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import Auth from 'Plugins/CommonUtils/AuthState'
import { FaSync, FaInfoCircle, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { Application } from 'Plugins/CommonUtils/SendPostRequest'
import { ApplicationPopup } from 'Components/ApplicationPopup';

interface BaseApplicationPageProps {
    userType: 'admin' | 'student' | 'teacher';
    getApplications: () => Promise<Application[]>;
    deleteApplication?: (applicationID: string) => Promise<void>;
    approveApplication?: (applicationID: string) => Promise<void>;
    rejectApplication?: (applicationID: string) => Promise<void>;
    showApproveReject: boolean;
    Layout: React.ComponentType<{ children: React.ReactNode }>;
    isOwnApplications: boolean;
}

const getApplicationTypeDisplay = (applicationType: string): string => {
    switch (applicationType) {
        case 'StudentManualSelectCourse':
            return 'Manual Selection';
        case 'TeacherAddCourse':
            return 'Course Addition';
        default:
            return applicationType;
    }
};

const getStatusSortOrder = (status: string): number => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 0;
        case 'rejected':
            return 1;
        case 'approved':
            return 2;
        default:
            return 3;
    }
};

export const BaseApplicationPage: React.FC<BaseApplicationPageProps> = ({
                                                                            userType,
                                                                            getApplications,
                                                                            deleteApplication,
                                                                            approveApplication,
                                                                            rejectApplication,
                                                                            showApproveReject,
                                                                            Layout,
                                                                            isOwnApplications
                                                                        }) => {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    useEffect(() => {
        handleGetApplications();
    }, []);

    const handleGetApplications = async () => {
        try {
            const apps = await getApplications();
            const sortedApps = apps.sort((a, b) =>
                getStatusSortOrder(a.status) - getStatusSortOrder(b.status)
            );
            setApplications(sortedApps);
            setSuccessMessage('Applications retrieved successfully');
            setErrorMessage('');
        } catch (error) {
            setApplications([]);
            setErrorMessage(error.message || 'Failed to retrieve applications');
            setSuccessMessage('');
        }
    };

    const handleDelete = async (applicationID: string) => {
        if (deleteApplication) {
            try {
                await deleteApplication(applicationID);
                setSuccessMessage('Application deleted successfully');
                setErrorMessage('');
                handleGetApplications();
            } catch (error) {
                setErrorMessage(error.message || 'Failed to delete application');
                setSuccessMessage('');
            }
        }
    };

    const handleApprove = async (applicationID: string) => {
        if (approveApplication) {
            try {
                await approveApplication(applicationID);
                setSuccessMessage('Application approved successfully');
                setErrorMessage('');
                handleGetApplications();
            } catch (error) {
                setErrorMessage(error.message || 'Failed to approve application');
                setSuccessMessage('');
            }
        }
    };

    const handleReject = async (applicationID: string) => {
        if (rejectApplication) {
            try {
                await rejectApplication(applicationID);
                setSuccessMessage('Application rejected successfully');
                setErrorMessage('');
                handleGetApplications();
            } catch (error) {
                setErrorMessage(error.message || 'Failed to reject application');
                setSuccessMessage('');
            }
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold mb-4">
                        {isOwnApplications ? "My Applications" : "Applications to Review"}
                    </h1>
                    <div className="flex items-center justify-between mb-4">
                        {errorMessage && <div className="text-red-500 dark:text-red-400">{errorMessage}</div>}
                        {successMessage && <div className="text-green-500 dark:text-green-400">{successMessage}</div>}
                        <button
                            onClick={handleGetApplications}
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
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Application Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Info</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {applications.map((app) => (
                                        <tr key={app.applicationID} className={`${
                                            app.status.toLowerCase() === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900' :
                                                app.status.toLowerCase() === 'rejected' ? 'bg-red-50 dark:bg-red-900' :
                                                    app.status.toLowerCase() === 'approved' ? 'bg-green-50 dark:bg-green-900' : ''
                                        }`}>
                                            <td className="px-6 py-4 whitespace-nowrap">{app.usertype}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{app.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{getApplicationTypeDisplay(app.applicationType)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => setSelectedApplication(app)}
                                                    className="text-blue-500 hover:text-blue-600"
                                                    title="View Details"
                                                >
                                                    <FaInfoCircle />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{app.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {showApproveReject && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(app.applicationID)}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-2"
                                                            title="Approve"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(app.applicationID)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-2"
                                                            title="Reject"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}
                                                {deleteApplication && (
                                                    <button
                                                        onClick={() => handleDelete(app.applicationID)}
                                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
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

            {selectedApplication && (
                <ApplicationPopup
                    application={{
                        ...selectedApplication,
                        applicationType: getApplicationTypeDisplay(selectedApplication.applicationType)
                    }}
                    onClose={() => setSelectedApplication(null)}
                    onApprove={showApproveReject ? handleApprove : undefined}
                    onReject={showApproveReject ? handleReject : undefined}
                    onDelete={deleteApplication ? handleDelete : undefined}
                    showApproveReject={showApproveReject}
                />
            )}
        </Layout>
    );
};