import React from 'react';

interface Props {
    courseDetails?: any;
    courseList?: any[];
    title: string;
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
                                <td className="scrollable-text">{courseDetails.courseHour}</td>
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