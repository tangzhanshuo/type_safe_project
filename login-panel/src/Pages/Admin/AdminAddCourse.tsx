import React, { Dispatch, SetStateAction, useState } from 'react'
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminAddCourseMessage } from 'Plugins/AdminAPI/AdminAddCourseMessage';
import { AdminLayout } from 'Components/Admin/AdminLayout';


export function AdminAddCourse() {
    const [courseID, setCourseID] = useState('');
    const [courseName, setCourseName] = useState('');
    const [teacherUsername, setTeacherUsername] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [info, setInfo] = useState('');
    const [courseHour, setCourseHour] = useState('');
    const [classroomID, setClassroomID] = useState('');
    const [credits, setCredits] = useState('');
    const [enrolledStudents, setEnrolledStudents] = useState('');
    const [allStudents, setAllStudents] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleAddCourse = async () => {
        if (!courseName || !teacherUsername || !teacherName || !capacity || !info || !courseHour || !classroomID || !credits || !enrolledStudents || !allStudents) {
            setErrorMessage('All fields are required');
            return;
        }


        const message = new AdminAddCourseMessage(
            courseName,
            teacherUsername,
            teacherName,
            parseInt(capacity, 10),
            info,
            courseHour,
            parseInt(classroomID, 10),
            parseInt(credits, 10),
            enrolledStudents,
            allStudents
        );

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
                setSuccessMessage('Course added successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to add course');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while adding course');
            setSuccessMessage('');
        }
    };

return (
    <AdminLayout>
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <form className="space-y-4" onSubmit={handleAddCourse}>
                    <input
                        id="courseName"
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Course Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="teacherUsername"
                        type="text"
                        value={teacherUsername}
                        onChange={(e) => setTeacherUsername(e.target.value)}
                        placeholder="Teacher Username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="teacherName"
                        type="text"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        placeholder="Teacher Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="capacity"
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="Capacity (e.g., 30)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="info"
                        type="text"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        placeholder="Course Info"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="courseHour"
                        type="text"
                        value={courseHour}
                        onChange={(e) => setCourseHour(e.target.value)}
                        placeholder="Course Hour"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="classroomID"
                        type="number"
                        value={classroomID}
                        onChange={(e) => setClassroomID(e.target.value)}
                        placeholder="Classroom ID (e.g., 101, -1 for no classroom)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="credits"
                        type="number"
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        placeholder="Credits (e.g., 3)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="enrolledStudents"
                        type="text"
                        value={enrolledStudents}
                        onChange={(e) => setEnrolledStudents(e.target.value)}
                        placeholder="Enrolled Students"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="allStudents"
                        type="text"
                        value={allStudents}
                        onChange={(e) => setAllStudents(e.target.value)}
                        placeholder="All Students"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                </form>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Add Course
                    </button>
                </div>

                <p className={`mt-4 text-center ${successMessage ? 'text-green-500' : 'text-red-500'}`}>
                    {successMessage || errorMessage}
                </p>
            </div>
        </div>
    </AdminLayout>
);
}