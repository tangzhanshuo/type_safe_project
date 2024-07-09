import React from 'react';

interface Props {
    courseDetails: any;
    courseList: any[];
}

export const RetrievedCourseInformation: React.FC<Props> = ({ courseDetails, courseList }) => {
    return (
        <>
            {courseDetails && (
                <div className="course-details">
                    <h2>Course Details</h2>
                    <div className="table-container">
                        <table className="course-table">
                            <thead>
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Teacher Username</th>
                                <th>Teacher Name</th>
                                <th>Capacity</th>
                                <th className="long-text">Info</th>
                                <th>Course Hour</th>
                                <th>Classroom ID</th>
                                <th>Credits</th>
                                <th className="long-text">Enrolled Students</th>
                                <th>Kwargs</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{courseDetails.courseid}</td>
                                <td>{courseDetails.coursename}</td>
                                <td>{courseDetails.teacherusername}</td>
                                <td>{courseDetails.teachername}</td>
                                <td>{courseDetails.capacity}</td>
                                <td className="long-text">{courseDetails.info}</td>
                                <td>{courseDetails.coursehour}</td>
                                <td>{courseDetails.classroomid}</td>
                                <td>{courseDetails.credits}</td>
                                <td className="long-text">{courseDetails.enrolledstudents}</td>
                                <td>{courseDetails.kwargs}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {courseList.length > 0 && (
                <div className="course-list">
                    <h2>Course List</h2>
                    <div className="table-container">
                        <table className="course-table">
                            <thead>
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Teacher Username</th>
                                <th>Teacher Name</th>
                                <th>Capacity</th>
                                <th className="long-text">Info</th>
                                <th>Course Hour</th>
                                <th>Classroom ID</th>
                                <th>Credits</th>
                                <th className="long-text">Enrolled Students</th>
                                <th>Kwargs</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courseList.map((course, index) => (
                                <tr key={index}>
                                    <td>{course.courseid}</td>
                                    <td>{course.coursename}</td>
                                    <td>{course.teacherusername}</td>
                                    <td>{course.teachername}</td>
                                    <td>{course.capacity}</td>
                                    <td className="long-text">{course.info}</td>
                                    <td>{course.coursehour}</td>
                                    <td>{course.classroomid}</td>
                                    <td>{course.credits}</td>
                                    <td className="long-text">{course.enrolledstudents}</td>
                                    <td>{course.kwargs}</td>
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
