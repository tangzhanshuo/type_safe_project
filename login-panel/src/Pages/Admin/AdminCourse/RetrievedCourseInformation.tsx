import React from 'react';

interface Props {
    courseDetails?: any;
    courseList?: any[];
    title: string;
}
// Step 1: Define a type for the accumulator
type Schedule = {
    [key: string]: Set<number>;
};

function formatCourseHours(courseHours: number[]): string {
    const weekMap = ['前八周', '后八周'];
    const dayMap = ['日', '一', '二', '三', '四', '五', '六'];
    const timeMap: { [key: string]: string } = {
        '0': '8:00~9:35',
        '1': '9:50~12:15',
        '2': '13:30~15:05',
        '3': '15:20~16:55',
        '4': '17:00~18:45',
        '5': '19:20~20:55',
    };

    // Step 2: Use the defined type in the reduce function
    const schedule = courseHours.reduce<Schedule>((acc, hour) => {
        const w = Math.floor(hour / 42);
        const d = Math.floor((hour - 42 * w) / 6);
        const h = hour - 42 * w - 6 * d;
        const key = `${d}-${h}`;

        if (!acc[key]) {
            acc[key] = new Set<number>();
        }
        acc[key].add(w);

        return acc;
    }, {});

    // Step 3: Explicitly declare the type of weeks
    return Object.entries(schedule).map(([key, weeks]) => {
        const [d, h] = key.split('-').map(Number);
        const weekStr = weeks.size === 2 ? '全周' : weekMap[[...weeks][0]];
        return `${weekStr} 星期${dayMap[d]} ${timeMap[h.toString()]}`;
    }).join('，');
}

export const RetrievedCourseInformation: React.FC<Props> = ({ courseDetails, courseList, title }) => {
    return (
        <>
            {courseDetails && (
                <div className="course-details">
                    <h2>{title}</h2>
                    <div className="table-container">
                        <table className="course-table">
                            <thead>
                            <tr>
                                <th className="scrollable-text">Course ID</th>
                                <th className="scrollable-text">Course Name</th>
                                <th className="scrollable-text">Teacher Username</th>
                                <th className="scrollable-text">Teacher Name</th>
                                <th className="scrollable-text">Capacity</th>
                                <th className="long-text">Info</th>
                                <th className="scrollable-text">Course Hour</th>
                                <th className="scrollable-text">Classroom ID</th>
                                <th className="scrollable-text">Credits</th>
                                <th className="long-text">Enrolled Students</th>
                                <th className="long-text">All Students</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="scrollable-text">{courseDetails.courseid}</td>
                                <td className="scrollable-text">{courseDetails.courseName}</td>
                                <td className="scrollable-text">{courseDetails.teacherUsername}</td>
                                <td className="scrollable-text">{courseDetails.teacherName}</td>
                                <td className="scrollable-text">{courseDetails.capacity}</td>
                                <td className="long-text">{courseDetails.info}</td>
                                <td className="scrollable-text">{formatCourseHours(courseDetails.courseHour)}</td>
                                <td className="scrollable-text">{courseDetails.classroomid}</td>
                                <td className="scrollable-text">{courseDetails.credits}</td>
                                <td className="long-text">{courseDetails.enrolledStudents}</td>
                                <td className="long-text">{courseDetails.allStudents}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {courseList && courseList.length > 0 && (
                <div className="course-list">
                    <h2>{title}</h2>
                    <div className="table-container">
                        <table className="course-table">
                            <thead>
                            <tr>
                                <th className="scrollable-text">Course ID</th>
                                <th className="scrollable-text">Course Name</th>
                                <th className="scrollable-text">Teacher Username</th>
                                <th className="scrollable-text">Teacher Name</th>
                                <th className="scrollable-text">Capacity</th>
                                <th className="long-text">Info</th>
                                <th className="scrollable-text">Course Hour</th>
                                <th className="scrollable-text">Classroom ID</th>
                                <th className="scrollable-text">Credits</th>
                                <th className="long-text">Enrolled Students</th>
                                <th className="long-text">All Students</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courseList.map((course, index) => (
                                <tr key={index}>
                                    <td className="scrollable-text">{course.courseid}</td>
                                    <td className="scrollable-text">{course.courseName}</td>
                                    <td className="scrollable-text">{course.teacherUsername}</td>
                                    <td className="scrollable-text">{course.teacherName}</td>
                                    <td className="scrollable-text">{course.capacity}</td>
                                    <td className="long-text">{course.info}</td>
                                    <td className="scrollable-text">{course.courseHour}</td>
                                    <td className="scrollable-text">{course.classroomid}</td>
                                    <td className="scrollable-text">{course.credits}</td>
                                    <td className="long-text">{course.enrolledStudents}</td>
                                    <td className="long-text">{course.allStudents}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};