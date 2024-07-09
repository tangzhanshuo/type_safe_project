import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CourseInformation } from './AdminCourse/CourseInformation';
import { StudentInformation } from './AdminCourse/StudentInformation';
import { ClassroomInformation } from './AdminCourse/ClassroomInformation';
import { RetrievedCourseInformation } from './AdminCourse/RetrievedCourseInformation';
import { RetrievedClassroomInformation } from './AdminCourse/RetrievedClassroomInformation';
import { AdminGetCourseListMessage } from 'Plugins/AdminAPI/AdminGetCourseListMessage';
import { AdminGetClassroomListMessage } from 'Plugins/AdminAPI/AdminGetClassroomListMessage';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import Auth from 'Plugins/CommonUtils/AuthState';
import 'Pages/css/AdminCourse.css';

export function AdminCourse() {
    const history = useHistory();
    const [activeSection, setActiveSection] = useState('course');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [courseDetails, setCourseDetails] = useState<any>(null);
    const [courseList, setCourseList] = useState<any[]>([]);
    const [classroomDetails, setClassroomDetails] = useState<any>(null);
    const [classroomList, setClassroomList] = useState<any[]>([]);
    const [availableClassrooms, setAvailableClassrooms] = useState<any[]>([]); // Add state for available classrooms

    useEffect(() => {
        const { usertype, username, password } = Auth.getState();

        if (!usertype || !username || !password) {
            history.push('/login');
        }

        if (usertype !== 'admin') {
            history.push('/');
        }
    }, [history]);

    useEffect(() => {
        const fetchCourseList = async () => {
            try {
                const message = new AdminGetCourseListMessage();
                const response = await sendPostRequest(message);
                if (!response.isError) {
                    setCourseList(response.data);
                } else {
                    setErrorMessage('Failed to retrieve course list');
                }
            } catch (error) {
                setErrorMessage('Error occurred while retrieving course list');
            }
        };

        fetchCourseList(); // Initial fetch

        const intervalId = setInterval(fetchCourseList, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    useEffect(() => {
        const fetchClassroomList = async () => {
            try {
                const message = new AdminGetClassroomListMessage();
                const response = await sendPostRequest(message);
                if (!response.isError) {
                    setClassroomList(response.data);
                } else {
                    setErrorMessage('Failed to retrieve classroom list');
                }
            } catch (error) {
                setErrorMessage('Error occurred while retrieving classroom list');
            }
        };

        fetchClassroomList(); // Initial fetch

        const intervalId = setInterval(fetchClassroomList, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        <div className="App">
            <button onClick={() => history.push('/')} className="back-to-main">
                Back to main
            </button>
            <header className="App-header">
                <h1>Admin Course Management</h1>
            </header>
            <main className="App-main">
                <div className="button-group">
                    <button onClick={() => setActiveSection('course')} className="button">
                        Course Information
                    </button>
                    <button onClick={() => setActiveSection('student')} className="button">
                        Student Information
                    </button>
                    <button onClick={() => setActiveSection('classroom')} className="button">
                        Classroom Information
                    </button>
                </div>
                {activeSection === 'course' && (
                    <CourseInformation
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                        setCourseDetails={setCourseDetails}
                        setAvailableClassrooms={setAvailableClassrooms} // Pass the function
                    />
                )}
                {activeSection === 'student' && (
                    <StudentInformation
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                    />
                )}
                {activeSection === 'classroom' && (
                    <ClassroomInformation
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                        setClassroomDetails={setClassroomDetails}
                    />
                )}
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <RetrievedCourseInformation courseDetails={courseDetails} courseList={courseList} />
                <RetrievedClassroomInformation classroomDetails={classroomDetails} classroomList={classroomList} />
                <RetrievedClassroomInformation classroomDetails={null} classroomList={availableClassrooms} /> {/* Display available classrooms */}
            </main>
        </div>
    );
}
