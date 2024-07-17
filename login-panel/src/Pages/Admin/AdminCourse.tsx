import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CourseInformation } from 'Pages/Admin/AdminCourse/CourseInformation';
import { StudentInformation } from 'Pages/Admin/AdminCourse/StudentInformation';
import { AdminClassroomInformation } from 'Pages/Admin/AdminClassroomInformation';
import { AdminLayout } from 'Components/Admin/AdminLayout'; // Step 1: Import AdminLayout
import Auth from 'Plugins/CommonUtils/AuthState';

export function AdminCourse() {
    const history = useHistory();
    const [activeSection, setActiveSection] = useState('course');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [courseDetails, setCourseDetails] = useState<any>(null);
    const [courseList, setCourseList] = useState<any[]>([]);
    const [classroomDetails, setClassroomDetails] = useState<any>(null);
    const [classroomList, setClassroomList] = useState<any[]>([]);
    const [availableClassrooms, setAvailableClassrooms] = useState<any[]>([]);

    useEffect(() => {
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            history.push('/login');
        }

        if (usertype !== 'admin') {
            history.push('/');
        }
    }, [history]);

    useEffect(() => {
        // Fetch course list logic
    }, []);

    useEffect(() => {
        // Fetch classroom list logic
    }, []);

    // Step 2: Wrap content with AdminLayout
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="button-group">
                        <button onClick={() => setActiveSection('course')} className="button">
                            Course Information
                        </button>
                        <button onClick={() => setActiveSection('student')} className="button">
                            Student Information
                        </button>
                    </div>
                    {activeSection === 'course' && (
                        <CourseInformation
                            setErrorMessage={setErrorMessage}
                            setSuccessMessage={setSuccessMessage}
                            setCourseDetails={setCourseDetails}
                            setAvailableClassrooms={setAvailableClassrooms}
                        />
                    )}
                    {activeSection === 'student' && (
                        <StudentInformation
                            setErrorMessage={setErrorMessage}
                            setSuccessMessage={setSuccessMessage}
                        />
                    )}
                    {activeSection === 'classroom' && (
                        <AdminClassroomInformation
                            setErrorMessage={setErrorMessage}
                            setSuccessMessage={setSuccessMessage}
                            setClassroomDetails={setClassroomDetails}
                        />
                    )}
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                </div>
            </div>
        </AdminLayout>
    );
}
