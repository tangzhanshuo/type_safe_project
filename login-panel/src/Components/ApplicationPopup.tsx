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
    const renderApproverInfo = (approvers: Approver[]) => {
        const approvedLines: JSX.Element[] = [];
        const pendingLines: JSX.Element[] = [];

        approvers.forEach((approver, index) => {
            if (approver.approved) {
                approvedLines.push(
                    <div key={index} className="text-green-500">
                        Approved by {approver.usertype} {approver.username}
                    </div>
                );
            } else if (approver.username === "") {
                pendingLines.push(
                    <div key={index} className="text-orange-500">
                        Waiting for a/an {approver.usertype}'s approval
                    </div>
                );
            } else {
                pendingLines.push(
                    <div key={index} className="text-orange-500">
                        Waiting for {approver.usertype} {approver.username}'s approval
                    </div>
                );
            }
        });

        return [...approvedLines, ...pendingLines];
    };

    const handleApprove = async () => {
        if (onApprove) {
            await onApprove(application.applicationID);
            onClose();
        }
    };

    const handleReject = async () => {
        if (onReject) {
            await onReject(application.applicationID);
            onClose();
        }
    };

    const handleDelete = async () => {
        if (onDelete) {
            await onDelete(application.applicationID);
            onClose();
        }
    };

    // Step 1: Define a type for the accumulator
    type Schedule = {
        [key: string]: Set<number>;
    };

    function formatCourseHours(courseHours: number[]): string {
        const weekMap = ['前八周', '后八周'];
        const dayMap = ['日', '一', '二', '三', '四', '五', '六'];
        const timeMap: { [key: string]: string } = {
            '0': '8:00~9:35',
            '1': '9:50~12:15',
            '2': '13:30~15:05',
            '3': '15:20~16:55',
            '4': '17:00~18:45',
            '5': '19:20~20:55',
        };

        // Step 2: Use the defined type in the reduce function
        const schedule = courseHours.reduce<Schedule>((acc, hour) => {
            const w = Math.floor(hour / 42);
            const d = Math.floor((hour - 42 * w) / 6);
            const h = hour - 42 * w - 6 * d;
            const key = `${d}-${h}`;

            if (!acc[key]) {
                acc[key] = new Set<number>();
            }
            acc[key].add(w);

            return acc;
        }, {});

        // Step 3: Explicitly declare the type of weeks
        return Object.entries(schedule).map(([key, weeks]) => {
            const [d, h] = key.split('-').map(Number);
            const weekStr = weeks.size === 2 ? '全周' : weekMap[[...weeks][0]];
            return `${weekStr} 星期${dayMap[d]} ${timeMap[h.toString()]}`;
        }).join('，');
    }

    function convertStringToNumberArray(inputString: string): number[] {
        // Step 1: Remove square brackets
        const trimmedString = inputString.replace(/^\[|\]$/g, '');
        // Step 2 & 3: Split by comma and convert each to number
        return trimmedString.split(',').map(Number);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <FaTimes/>
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
                        console.log(convertStringToNumberArray(infoObj['courseHour']));
                        return propertiesToShow.map((prop, index) => {
                            // Check if the property is courseHour and call Func if it is
                            const valueToShow = prop === 'courseHour' ? formatCourseHours(convertStringToNumberArray(infoObj[prop])) : infoObj[prop];
                            return infoObj[prop] ? (
                                <div key={index} className="ml-4">
                                    <strong>{prop}:</strong> {valueToShow}
                                </div>
                            ) : null;
                        });
                    })()}
                </div>
                <div className="mb-4">
                    <strong>Approvers:</strong>
                    <div className="ml-4">
                        {renderApproverInfo(application.approver)}
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    {showApproveReject && onApprove && (
                        <button
                            onClick={handleApprove}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <FaCheck className="mr-2"/> Approve
                        </button>
                    )}
                    {showApproveReject && onReject && (
                        <button
                            onClick={handleReject}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <FaTimes className="mr-2"/> Reject
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <FaTrash className="mr-2"/> Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};