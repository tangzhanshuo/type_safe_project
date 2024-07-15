import React, { useState, Dispatch, SetStateAction } from 'react';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminAddCourseMessage } from 'Plugins/AdminAPI/AdminAddCourseMessage';
import { AdminGetCourseMessage } from 'Plugins/AdminAPI/AdminGetCourseMessage';
import { AdminUpdateCourseMessage } from 'Plugins/AdminAPI/AdminUpdateCourseMessage';
import { AdminDeleteCourseMessage } from 'Plugins/AdminAPI/AdminDeleteCourseMessage';
import { AdminGetAvailableClassroomByCapacityHourMessage } from 'Plugins/AdminAPI/AdminGetAvailableClassroomByCapacityHourMessage';

interface Props {
    setErrorMessage: Dispatch<SetStateAction<string>>;
    setSuccessMessage: Dispatch<SetStateAction<string>>;
    setCourseDetails: Dispatch<SetStateAction<any>>;
    setAvailableClassrooms: Dispatch<SetStateAction<any[]>>; // Add this line
}

export const CourseInformation: React.FC<Props> = ({ setErrorMessage, setSuccessMessage, setCourseDetails, setAvailableClassrooms }) => {
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

    const handleGetCourse = async () => {
        if (!courseID) {
            setErrorMessage('Course ID is required');
            return;
        }

        const message = new AdminGetCourseMessage(parseInt(courseID, 10));

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
                setCourseDetails(response.data);
                setSuccessMessage('Course details retrieved successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to retrieve course details');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while retrieving course details');
            setSuccessMessage('');
        }
    };

    const handleUpdateCourse = async () => {
        if (!courseID) {
            setErrorMessage('Course ID is required');
            return;
        }

        const message = new AdminUpdateCourseMessage(
            parseInt(courseID, 10),
            courseName || undefined,
            teacherUsername || undefined,
            teacherName || undefined,
            capacity ? parseInt(capacity, 10) : undefined,
            info || undefined,
            courseHour || undefined,
            classroomID ? parseInt(classroomID, 10) : undefined,
            credits ? parseInt(credits, 10) : undefined,
            enrolledStudents || undefined,
            allStudents || undefined
        );

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
                setSuccessMessage('Course updated successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to update course');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while updating course');
            setSuccessMessage('');
        }
    };

    const handleDeleteCourse = async () => {
        if (!courseID) {
            setErrorMessage('Course ID is required');
            return;
        }

        const message = new AdminDeleteCourseMessage(parseInt(courseID, 10));

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
                setSuccessMessage('Course deleted successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to delete course');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while deleting course');
            setSuccessMessage('');
        }
    };

    const handleGetAvailableClassrooms = async () => {
        if (!capacity || !courseHour) {
            setErrorMessage('Capacity and Course Hour are required');
            return;
        }

        const message = new AdminGetAvailableClassroomByCapacityHourMessage(
            parseInt(capacity, 10),
            courseHour
        );

        try {
            const response = await sendPostRequest(message);
            if (!response.isError) {
                setAvailableClassrooms(response.data);
                setSuccessMessage('Available classrooms retrieved successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to retrieve available classrooms');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error occurred while retrieving available classrooms');
            setSuccessMessage('');
        }
    };


    return (
        <section className="course-info">
            <h2>Course Information</h2>
            <div className="input-group">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Course ID (Number)"
                        value={courseID}
                        onChange={(e) => setCourseID(e.target.value)}
                        className="input-field"
                    />
                    <label>Course ID (Number)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Course Name (Text)"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="input-field"
                    />
                    <label>Course Name (Text)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Teacher Username (Text)"
                        value={teacherUsername}
                        onChange={(e) => setTeacherUsername(e.target.value)}
                        className="input-field"
                    />
                    <label>Teacher Username (Text)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Teacher Name (Text)"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        className="input-field"
                    />
                    <label>Teacher Name (Text)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Capacity (Number)"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="input-field"
                    />
                    <label>Capacity (Number)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Info (Text)"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        className="input-field"
                    />
                    <label>Info (Text)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Course Hour (JSON List[Number])"
                        value={courseHour}
                        onChange={(e) => setCourseHour(e.target.value)}
                        className="input-field"
                    />
                    <label>Course Hour (JSON List[Number])</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Classroom ID (Number)"
                        value={classroomID}
                        onChange={(e) => setClassroomID(e.target.value)}
                        className="input-field"
                    />
                    <label>Classroom ID (Number)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Credits (Number)"
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        className="input-field"
                    />
                    <label>Credits (Number)</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enrolled Students (JSON List[Text])"
                        value={enrolledStudents}
                        onChange={(e) => setEnrolledStudents(e.target.value)}
                        className="input-field"
                    />
                    <label>Enrolled Students (JSON List[Text])</label>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="AllStudents (JSON)"
                        value={allStudents}
                        onChange={(e) => setAllStudents(e.target.value)}
                        className="input-field"
                    />
                    <label>AllStudents (JSON)</label>
                </div>
            </div>
            <div className="button-group">
                <button onClick={handleAddCourse} className="button">
                    Add Course
                </button>
                <button onClick={handleGetCourse} className="button">
                    Get Course Details
                </button>
                <button onClick={handleUpdateCourse} className="button">
                    Update Course
                </button>
                <button onClick={handleDeleteCourse} className="button">
                    Delete Course
                </button>
                <button onClick={handleGetAvailableClassrooms} className="button"> {/* Add this button */}
                    Get Available Classrooms
                </button>
            </div>
        </section>
    );
};
