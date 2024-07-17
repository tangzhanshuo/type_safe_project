import React, { useState } from 'react';
import { Course } from 'Plugins/CommonUtils/SendPostRequest';

interface ManualSelectBoxProps {
    course: Course;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
}

export const ManualSelectBox: React.FC<ManualSelectBoxProps> = ({ course, onConfirm, onCancel }) => {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        onConfirm(reason);
        setReason('');
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Manual Selection</h2>
                <p className="mb-2">Course: {course.courseName}</p>
                <p className="mb-4">ID: {course.courseid}</p>
                <textarea
                    className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                    rows={4}
                    placeholder="Enter your reasons for manual selection..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                ></textarea>
                <div className="flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};