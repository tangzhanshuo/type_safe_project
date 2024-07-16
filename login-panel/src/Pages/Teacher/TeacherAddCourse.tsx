import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherAddCourseMessage } from 'Plugins/TeacherAPI/TeacherAddCourseMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';
import 'Pages/css/Main.css';

export function TeacherAddCourse() {
    const history = useHistory();
    const [courseID, setCourseID] = useState('');
    const [courseName, setCourseName] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [info, setInfo] = useState('');
    const [courseHourJson, setCourseHourJson] = useState('');
    const [classroomID, setClassroomID] = useState('');
    const [credits, setCredits] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [addCourseResponse, setAddCourseResponse] = useState('');

    useEffect(() => {
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            history.push('/login');
        } else if (usertype !== 'teacher') {
            history.push('/');
        }
    }, [history]);

    const addCourse = async () => {
        if (!courseName || !teacherName || !capacity || !courseHourJson || !classroomID || !credits) {
            setAddCourseResponse('Please ensure all fields are correctly filled.');
            return;
        }
        console.log(+courseID, courseName, teacherName, +capacity, info, courseHourJson, +classroomID, +credits)
        const response = await sendPostRequest(new TeacherAddCourseMessage(+courseID, courseName, teacherName, +capacity, info, courseHourJson, +classroomID, +credits));
        if (response.isError) {
            setAddCourseResponse(response.error);
            return;
        }
        setAddCourseResponse('Course added successfully, waiting for approval');
    }


    return (
        <TeacherLayout>
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <form className="space-y-4">
                        <input id="courseName" type="string" value={courseName}
                               onChange={(e) => setCourseName(e.target.value)} placeholder="Course Name"
                               className="input-field w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
                        <input id="teacherName" type="string" value={teacherName}
                               onChange={(e) => setTeacherName(e.target.value)} placeholder="Teacher Name"
                               className="input-field w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
                        <input id="capacity" type="number" value={capacity || ''}
                               onChange={(e) => setCapacity(e.target.value)} placeholder="Capacity (e.g., 30)"
                               className="input-field w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
                        <input id="info" type="string" value={info} onChange={(e) => setInfo(e.target.value)}
                               placeholder="Course Info" className="input-field w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
                        <input id="courseHourJson" type="string" value={courseHourJson}
                               onChange={(e) => setCourseHourJson(e.target.value)}
                               placeholder="Course Hour JSON (e.g. [12,32])" className="input-field w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
                        <input id="classroomID" type="number" value={classroomID || ''}
                               onChange={(e) => setClassroomID(e.target.value)}
                               placeholder="Classroom ID (e.g. 101, -1 for no classroom)" className="input-field w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
                        <input id="credits" type="number" value={credits || ''}
                               onChange={(e) => setCredits(e.target.value)} placeholder="Credits (e.g., 3)"
                               className="input-field w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
                    </form>

                    <div className="button-group">
                        <button onClick={addCourse}
                                style={{marginTop: '30px'}}
                                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105">
                            Register Course
                        </button>
                    </div>

                    <p className={addCourseResponse === 'Course added successfully, waiting for approval' ? 'text-green-500' : 'text-red-500'}>
                        {addCourseResponse}
                    </p>
                </div>
            </div>
        </TeacherLayout>
    );
}