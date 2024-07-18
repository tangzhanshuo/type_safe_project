import React, { useEffect, useState } from 'react';
import { sendPostRequest, Classroom } from 'Plugins/CommonUtils/SendPostRequest';
import { StudentCourse, StudentWaitingPosition } from 'Plugins/CommonUtils/StudentUtils';
import { StudentGetWaitingPositionMessage } from 'Plugins/StudentAPI/StudentGetWaitingPositionMessage';
import { StudentGetClassroomListMessage } from 'Plugins/StudentAPI/StudentGetClassroomListMessage';
import { StudentLayout } from 'Components/Student/StudentLayout';

const timeSlots: string[] = [
    "8:00-9:35",
    "9:50-12:15",
    "13:30-15:05",
    "15:20-16:05",
    "19:20-20:55",
    "21:00-21:45"
];

interface WeekParts {
    [key: string]: { [key: number]: boolean };
}

export function StudentCurriculum() {
    const [waitingPositions, setWaitingPositions] = useState<StudentWaitingPosition[]>([]);
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        fetchCurriculumData();
        fetchClassroomData();
    }, []);

    const fetchCurriculumData = async () => {
        const response = await sendPostRequest(new StudentGetWaitingPositionMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            setWaitingPositions([]);
            return;
        }
        if (response.data) {
            setWaitingPositions(response.data);
        } else {
            setWaitingPositions([]);
        }
    };

    const fetchClassroomData = async () => {
        const response = await sendPostRequest(new StudentGetClassroomListMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            setClassrooms([]);
            return;
        }
        if (response.data) {
            setClassrooms(response.data);
        } else {
            setClassrooms([]);
        }
    };

    const getClassroomName = (classroomid: number) => {
        const classroom = classrooms.find(room => room.classroomid === classroomid);
        return classroom ? classroom.classroomName : `教室：${classroomid}`;
    };

    const generateCurriculumGrid = () => {
        const grid = Array.from({ length: 6 }, () => Array(7).fill(null));

        waitingPositions.forEach(position => {
            const courseHours = position.studentCourse.courseHour;
            const weekParts: WeekParts = courseHours.reduce((acc: WeekParts, hour: number) => {
                const weekPart = Math.floor(hour / 42);
                const weekDay = Math.floor((hour % 42) / 6);
                const dayPeriod = hour % 6;
                const key = `${weekDay}-${dayPeriod}`;
                if (!acc[key]) acc[key] = {};
                acc[key][weekPart] = true;
                return acc;
            }, {});

            const isWaiting = position.studentCourse.studentStatus === "Waiting";
            const candidatePrefix = isWaiting ? "(候选) " : "";
            const courseName = `${position.studentCourse.courseName}`;
            const teacherName = position.studentCourse.teacherName;
            const classroomName = getClassroomName(position.studentCourse.classroomid);

            const primaryContent = (
                <span className="font-bold text-gray-900">
                    {candidatePrefix}{teacherName}: {courseName}
                </span>
            );
            const secondaryContent = (
                <span className="text-gray-600">
                    (教室：{classroomName})
                </span>
            );

            for (const [key, value] of Object.entries(weekParts)) {
                const [weekDay, dayPeriod] = key.split('-').map(Number);
                const weekLabel = value[0] && value[1] ? "(全周)" : value[0] ? "(前八周)" : "(后八周)";
                const combinedContent = (
                    <div>
                        {primaryContent}{weekLabel}<br/>{secondaryContent}
                    </div>
                );

                if (!grid[dayPeriod][weekDay]) {
                    grid[dayPeriod][weekDay] = { content: [combinedContent] };
                } else {
                    grid[dayPeriod][weekDay].content.push(combinedContent);
                }
            }
        });

        return grid;
    };

    const curriculumGrid = generateCurriculumGrid();

    return (
        <StudentLayout>
            <div className="w-full max-w-none space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Curriculum</h2>
                    <button
                        onClick={() => {
                            fetchCurriculumData();
                            fetchClassroomData();
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded transition duration-300"
                        title="Refresh curriculum"
                    >
                        Refresh
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 overflow-x-auto">
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs font-bold table-fixed">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-3 py-8 text-left text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time Slot</th>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <th key={day} className="px-3 py-8 text-left text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{day}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 text-xs">
                        {curriculumGrid.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="px-3 py-8 whitespace-nowrap">{timeSlots[rowIndex]}</td>
                                {row.map((cell, colIndex) => (
                                    <td key={colIndex} className={`px-3 py-8 whitespace-nowrap`}>
                                        {cell ? cell.content.map((item: string, index: number) => (
                                            <div key={index} className="whitespace-nowrap overflow-hidden overflow-ellipsis">{item}</div>
                                        )) : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </StudentLayout>
    );

}
