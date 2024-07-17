import React, { useState } from 'react';
import { sendPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminAddCourseMessage } from 'Plugins/AdminAPI/AdminAddCourseMessage';
import { UserGetInfoMessage } from 'Plugins/UserAPI/UserGetInfoMessage';
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { CourseAddForm } from 'Components/CourseAddForm';

export function AdminAddCourse(): JSX.Element {
    const [addCourseResponse, setAddCourseResponse] = useState<string>('');
    const [teacherName, setTeacherName] = useState<string>('');

    const fetchTeacherInfo = async (username: string) => {
        const response = await sendPostRequest(new UserGetInfoMessage("teacher", username));
        if (response.isError) {
            setTeacherName('');
            return '';
        } else {
            const info = response.data;
            const name = info.name || '';
            setTeacherName(name);
            return name;
        }
    };

    const handleAddCourse = async (courseData: {
        courseName: string;
        teacherUsername: string;
        capacity: number;
        info: string;
        courseHourArray: number[];
        classroomID: number;
        credits: number;
    }) => {
        const teacherName = await fetchTeacherInfo(courseData.teacherUsername);
        if (!teacherName) {
            setAddCourseResponse('Error: Unable to fetch teacher information');
            return;
        }

        const response = await sendPostRequest(new AdminAddCourseMessage(
            courseData.courseName,
            courseData.teacherUsername,
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
            setAddCourseResponse('Course added successfully');
        }
    };

    return (
        <AdminLayout>
            <CourseAddForm isAdmin={true} onSubmit={handleAddCourse} />
            <p className={`mt-4 text-center ${addCourseResponse === 'Course added successfully' ? 'text-green-500' : 'text-red-500'}`}>
                {addCourseResponse}
            </p>
        </AdminLayout>
    );
}