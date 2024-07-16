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
    const [allStudentsJson, setAllStudentsJson] = useState('');
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
        if (!courseName || !teacherName || !capacity || !info || !courseHourJson || !classroomID || !credits || !allStudentsJson) {
            setAddCourseResponse('Please ensure all fields are correctly filled.');
            return;
        }

        const response = await sendPostRequest(new TeacherAddCourseMessage(+courseID, courseName, teacherName, +capacity, info, courseHourJson, +classroomID, +credits, allStudentsJson));
        if (response.isError) {
            setAddCourseResponse(response.error);
            return;
        }
        setAddCourseResponse('Course added successfully.');
    }


    return (
        <TeacherLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Add New Course</h1>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <form className="space-y-4">
                        <input id="courseName" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Course Name" className="input-field" />
                        <input id="teacherName" type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="Teacher Name" className="input-field" />
                        <input id="capacity" type="text" value={capacity || ''} onChange={(e) => setCapacity(e.target.value)} placeholder="Capacity (e.g., 30)" className="input-field" />
                        <input id="info" type="text" value={info} onChange={(e) => setInfo(e.target.value)} placeholder="Course Info" className="input-field" />
                        <input id="courseHourJson" type="text" value={courseHourJson} onChange={(e) => setCourseHourJson(e.target.value)} placeholder="Course Hour JSON (e.g. [12,32])" className="input-field" />
                        <input id="classroomID" type="text" value={classroomID || ''} onChange={(e) => setClassroomID(e.target.value)} placeholder="Classroom ID (e.g. 101, -1 for no classroom)" className="input-field" />
                        <input id="credits" type="text" value={credits || ''} onChange={(e) => setCredits(e.target.value)} placeholder="Credits (e.g., 3)" className="input-field" />
                        <input id="allStudentsJson" type="text" value={allStudentsJson} onChange={(e) => setAllStudentsJson(e.target.value)} placeholder="Enrolled Student JSON (e.g.,['a'])" className="input-field" />
                    </form>
                    <div className="button-group">
                        <button onClick={addCourse} className="button">Register Course</button>
                        <button onClick={() => history.push('/teacher/course')} className="button">Back To Courses</button>
                        <button onClick={() => history.push('/teacher/dashboard')} className="button">Back to TeacherMain</button>
                        <button onClick={() => logout(history)} className="button">Log out</button>
                    </div>
                    {addCourseResponse && <p className="text-red-500">{addCourseResponse}</p>}
                </div>
            </div>
        </TeacherLayout>
    );
}