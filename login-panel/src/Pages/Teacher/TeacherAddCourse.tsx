import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { TeacherAddCourseMessage } from 'Plugins/TeacherAPI/TeacherAddCourseMessage';
import { UserGetInfoMessage } from 'Plugins/UserAPI/UserGetInfoMessage';
import Auth from 'Plugins/CommonUtils/AuthState';
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';
import { CourseAddForm } from 'Components/CourseAddForm';

export function TeacherAddCourse(): JSX.Element {
    const history = useHistory();
    const [teacherName, setTeacherName] = useState<string>('');
    const [addCourseResponse, setAddCourseResponse] = useState<string>('');

    useEffect(() => {
        fetchTeacherInfo();
    }, []);

    const fetchTeacherInfo = async () => {
        const response = await sendPostRequest(new UserGetInfoMessage("teacher", Auth.getState().username));
        if (response.isError) {
            setTeacherName('');
        } else {
            const info = response.data;
            setTeacherName(info.name || '');
        }
    };

    const handleAddCourse = async (courseData: {
        courseName: string;
        capacity: number;
        info: string;
        courseHourArray: number[];
        classroomID: number;
        credits: number;
    }) => {
        const response = await sendPostRequest(new TeacherAddCourseMessage(
            courseData.courseName,
            teacherName,
            courseData.capacity,
            courseData.info,
            courseData.courseHourArray,
            courseData.classroomID,
            courseData.credits
        ));
        if (response.isError) {
            setAddCourseResponse(response.error);
        } else {
            setAddCourseResponse('Course added successfully, waiting for approval');
        }
    };

    return (
        <TeacherLayout>
            <CourseAddForm isAdmin={false} onSubmit={handleAddCourse} />
            <p className={`mt-4 text-center ${addCourseResponse === 'Course added successfully, waiting for approval' ? 'text-green-500' : 'text-red-500'}`}>
                {addCourseResponse}
            </p>
        </TeacherLayout>
    );
}