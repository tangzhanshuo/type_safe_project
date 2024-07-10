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
                                <th>Classroom ID</th>
                                <th>Classroom Name</th>
                                <th>Capacity</th>
                                <th className="long-text">Enrolled Courses</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{classroomDetails.classroomid}</td>
                                <td>{classroomDetails.classroomname}</td>
                                <td>{classroomDetails.capacity}</td>
                                <td className="long-text">{classroomDetails.enrolledcourses}</td>
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
                                <th>Classroom ID</th>
                                <th>Classroom Name</th>
                                <th>Capacity</th>
                                <th className="long-text">Enrolled Courses</th>
                            </tr>
                            </thead>
                            <tbody>
                            {classroomList.map((classroom, index) => (
                                <tr key={index}>
                                    <td>{classroom.classroomid}</td>
                                    <td>{classroom.classroomname}</td>
                                    <td>{classroom.capacity}</td>
                                    <td className="long-text">{classroom.enrolledcourses}</td>
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
