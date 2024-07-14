import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherAddCourseMessage } from 'Plugins/TeacherAPI/TeacherAddCourseMessage';
import { logout } from 'Plugins/CommonUtils/UserManager';
import Auth from 'Plugins/CommonUtils/AuthState';
import 'Pages/css/Main.css';

export function TeacherCourseAddtion() {
    const history = useHistory();
    const [courseID, setCourseID] = useState(0); // [1]
    const [courseName, setCourseName] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [capacity, setCapacity] = useState(0);
    const [info, setInfo] = useState('');
    const [courseHourJson, setCourseHourJson] = useState('');
    const [classroomID, setClassroomID] = useState(0);
    const [credits, setCredits] = useState(0);
    const [allStudentsJson, setAllStudentsJson] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [addCourseResponse, setAddCourseResponse] = useState('');
    const [deleteCourseResponse, setDeleteCourseResponse] = useState('');
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            history.push('/login');
        } else if (usertype !== 'teacher') {
            history.push('/');
        }
    }, [history]);

    const addCourse = async () => {
        setCourseID(0)
        if (!courseName || !teacherName || capacity === null || !info || !courseHourJson || classroomID === null || credits === null || !allStudentsJson) {
            setAddCourseResponse('Please ensure all fields are correctly filled.');
            return;
        }

        if (typeof courseName !== 'string') {
            setAddCourseResponse('Invalid course name');
            return;
        }
        if (typeof teacherName !== 'string') {
            setAddCourseResponse('Invalid teacher name');
            return;
        }
        if (typeof capacity !== 'number') {
            setAddCourseResponse('Invalid capacity');
            return;
        }
        if (typeof info !== 'string') {
            setAddCourseResponse('Invalid info');
            return;
        }
        if (typeof courseHourJson !== 'string') {
            setAddCourseResponse('Invalid course hour JSON');
            return;
        }
        if (typeof classroomID !== 'number') {
            setAddCourseResponse('Invalid classroom ID');
            return;
        }
        if (typeof credits !== 'number') {
            setAddCourseResponse('Invalid credits');
            return;
        }
        if (typeof allStudentsJson !== 'string') {
            setAddCourseResponse('Invalid kwargs JSON');
            return;
        }

        const response = await sendPostRequest(new TeacherAddCourseMessage(courseID, courseName, teacherName, capacity, info, courseHourJson, classroomID, credits, allStudentsJson));
        if (response.isError) {
            setAddCourseResponse(response.error);
            return;
        }
        setAddCourseResponse(`Course added successfully.`);
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Add New Course</h1>
            </header>
            <main className="App-main">
                <div className="form-group">
                    <div className="form-row">
                        <label htmlFor="courseName" className="label-above">
                            Course Name
                        </label>
                        <input id="courseName" type="text" value={courseName}
                               onChange={(e) => setCourseName(e.target.value)}
                               placeholder="String" className="input-field" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="teacherName" className="label-above">
                            Teacher Name
                        </label>
                        <input id="teacherName" type="text" value={teacherName}
                               onChange={(e) => setTeacherName(e.target.value)}
                               placeholder="String" className="input-field" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="capacity" className="label-above">
                            Capacity
                        </label>
                        <input id="capacity" type="number" value={capacity}
                               onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                               placeholder="Number" className="input-field" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="info" className="label-above">
                            Info
                        </label>
                        <input id="info" type="text" value={info}
                               onChange={(e) => setInfo(e.target.value)}
                               placeholder="String" className="input-field" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="courseHourJson" className="label-above">
                            Course Hour
                        </label>
                        <input id="courseHourJson" type="text" value={courseHourJson}
                               onChange={(e) => setCourseHourJson(e.target.value)}
                               placeholder="JSON String" className="input-field" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="classroomID" className="label-above">
                            Classroom ID
                        </label>
                        <input id="classroomID" type="number" value={classroomID}
                               onChange={(e) => setClassroomID(parseInt(e.target.value, 10))}
                               placeholder="Number" className="input-field" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="credits" className="label-above">
                            Credits
                        </label>
                        <input id="credits" type="number" value={credits}
                               onChange={(e) => setCredits(parseInt(e.target.value, 10))}
                               placeholder="Number" className="input-field" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="allStudentsJson" className="label-above">
                            Kwargs
                        </label>
                        <input id="allStudentsJson" type="text" value={allStudentsJson}
                               onChange={(e) => setAllStudentsJson(e.target.value)}
                               placeholder="JSON String" className="input-field" />
                    </div>
                </div>
                <div className="button-group">
                    <button onClick={addCourse} className="button">
                        Register Course
                    </button>
                    <button onClick={() => history.push('/teacher/coursemanage')} className="button">
                        Back To CourseManagement
                    </button>
                    <button onClick={() => history.push('/teacher')} className="button">
                        Back to TeacherMain
                    </button>
                    <button onClick={() => logout(history)} className="button">
                        Log out
                    </button>
                </div>
                {addCourseResponse && <p>{addCourseResponse}</p>}
            </main>
        </div>
    );
}