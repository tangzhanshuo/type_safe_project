import React from 'react';

interface Props {
    classroomDetails?: any;
    classroomList?: any[];
    title: string;
}

export const RetrievedClassroomInformation: React.FC<Props> = ({ classroomDetails, classroomList, title }) => {
    return (
        <>
            {classroomDetails && (
                <div className="classroom-details">
                    <h2>{title}</h2>
                    <div className="table-container">
                        <table className="classroom-table">
                            <thead>
                            <tr>
                                <th className="scrollable-text">Classroom ID</th>
                                <th className="scrollable-text">Classroom Name</th>
                                <th className="scrollable-text">Capacity</th>
                                <th className="long-text">Enrolled Courses</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="scrollable-text">{classroomDetails.classroomid}</td>
                                <td className="scrollable-text">{classroomDetails.classroomName}</td>
                                <td className="scrollable-text">{classroomDetails.capacity}</td>
                                <td className="long-text">{classroomDetails.enrolledCourses}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {classroomList && classroomList.length > 0 && (
                <div className="classroom-list">
                    <h2>{title}</h2>
                    <div className="table-container">
                        <table className="classroom-table">
                            <thead>
                            <tr>
                                <th className="scrollable-text">Classroom ID</th>
                                <th className="scrollable-text">Classroom Name</th>
                                <th className="scrollable-text">Capacity</th>
                                <th className="long-text">Enrolled Courses</th>
                            </tr>
                            </thead>
                            <tbody>
                            {classroomList.map((classroom, index) => (
                                <tr key={index}>
                                    <td className="scrollable-text">{classroom.classroomid}</td>
                                    <td className="scrollable-text">{classroom.classroomName}</td>
                                    <td className="scrollable-text">{classroom.capacity}</td>
                                    <td className="long-text">{classroom.enrolledCourses}</td>
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