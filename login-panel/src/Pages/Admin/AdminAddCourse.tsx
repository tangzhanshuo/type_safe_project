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
            <form onSubmit={handleAddCourse}>
                <div className="input-container">
                    <input type="text" placeholder="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="input-field" />
                    <label>Course Name</label>
                </div>
                <div className="input-container">
                    <input type="text" placeholder="Teacher Username" value={teacherUsername} onChange={(e) => setTeacherUsername(e.target.value)} className="input-field" />
                    <label>Teacher Username</label>
                </div>
                <div className="input-container">
                    <input type="text" placeholder="Teacher Name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className="input-field" />
                    <label>Teacher Name</label>
                </div>
                <div className="input-container">
                    <input type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="input-field" />
                    <label>Capacity</label>
                </div>
                <div className="input-container">
                    <input type="text" placeholder="Info" value={info} onChange={(e) => setInfo(e.target.value)} className="input-field" />
                    <label>Info</label>
                </div>
                <div className="input-container">
                    <input type="text" placeholder="Course Hour" value={courseHour} onChange={(e) => setCourseHour(e.target.value)} className="input-field" />
                    <label>Course Hour</label>
                </div>
                <div className="input-container">
                    <input type="number" placeholder="Classroom ID" value={classroomID} onChange={(e) => setClassroomID(e.target.value)} className="input-field" />
                    <label>Classroom ID</label>
                </div>
                <div className="input-container">
                    <input type="number" placeholder="Credits" value={credits} onChange={(e) => setCredits(e.target.value)} className="input-field" />
                    <label>Credits</label>
                </div>
                <div className="input-container">
                    <input type="text" placeholder="Enrolled Students" value={enrolledStudents} onChange={(e) => setEnrolledStudents(e.target.value)} className="input-field" />
                    <label>Enrolled Students</label>
                </div>
                <div className="input-container">
                    <input type="text" placeholder="All Students" value={allStudents} onChange={(e) => setAllStudents(e.target.value)} className="input-field" />
                    <label>All Students</label>
                </div>
                <div className="button-group">
                    <button type="submit" className="button">Add Course</button>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
            </form>
        </AdminLayout>
    );
}