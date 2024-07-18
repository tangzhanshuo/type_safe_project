import React from 'react';
import { FaTimes, FaCheck, FaTrash } from "react-icons/fa";
import { Application, Approver } from 'Plugins/CommonUtils/SendPostRequest';

interface ApplicationPopupProps {
    application: Application;
    onClose: () => void;
    onApprove?: (applicationID: string) => Promise<void>;
    onReject?: (applicationID: string) => Promise<void>;
    onDelete?: (applicationID: string) => Promise<void>;
    showApproveReject: boolean;
}

export const ApplicationPopup: React.FC<ApplicationPopupProps> = ({
                                                                      application,
                                                                      onClose,
                                                                      onApprove,
                                                                      onReject,
                                                                      onDelete,
                                                                      showApproveReject
                                                                  }) => {
    const renderApproverInfo = (approver: Approver | undefined) => {
        if (!approver) return <div>No approver</div>;
        return (
            <div>
                <div>{approver.usertype}: {approver.username}</div>
                <div>Approved: {approver.approved ? 'Yes' : 'No'}</div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <FaTimes />
                </button>
                <h2 className="text-2xl font-bold mb-4">Application Details</h2>
                <div className="mb-4">
                    <strong>User Type:</strong> {application.usertype}
                </div>
                <div className="mb-4">
                    <strong>Username:</strong> {application.username}
                </div>
                <div className="mb-4">
                    <strong>Application Type:</strong> {application.applicationType}
                </div>
                <div className="mb-4">
                    <strong>Status:</strong> {application.status}
                </div>
                <div className="mb-4">
                    <strong>Info:</strong>
                    {(() => {
                        const infoObj = JSON.parse(application.info);
                        const propertiesToShow = ['courseID', 'info', 'credits', 'capacity', 'courseHour', 'courseName', 'classroomID', 'teacherName'];
                        return propertiesToShow.map((prop, index) => (
                            infoObj[prop] ?
                                <div key={index} className="ml-4">
                                    <strong>{prop}:</strong> {infoObj[prop]}
                                </div> : null
                        ));
                    })()}
                </div>
                <div className="mb-4">
                    <strong>Approvers:</strong>
                    <div className="ml-4">
                        <div>Approver 1: {renderApproverInfo(application.approver[0])}</div>
                        <div>Approver 2: {renderApproverInfo(application.approver[1])}</div>
                        <div>Approver 3: {renderApproverInfo(application.approver[2])}</div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    {showApproveReject && onApprove && (
                        <button
                            onClick={() => onApprove(application.applicationID)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <FaCheck className="mr-2" /> Approve
                        </button>
                    )}
                    {showApproveReject && onReject && (
                        <button
                            onClick={() => onReject(application.applicationID)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <FaTimes className="mr-2" /> Reject
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(application.applicationID)}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <FaTrash className="mr-2" /> Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};