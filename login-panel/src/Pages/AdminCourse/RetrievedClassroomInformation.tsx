import React from 'react';

interface Props {
    classroomDetails: any;
    classroomList: any[];
}

export const RetrievedClassroomInformation: React.FC<Props> = ({ classroomDetails, classroomList }) => {
    return (
        <>
            {classroomDetails && (
                <div className="classroom-details">
                    <h2>Classroom Details</h2>
                    <div className="table-container">
                        <table className="classroom-table">
                            <thead>
                            <tr>
                                <th>Classroom ID</th>
                                <th>Classroom Name</th>
                                <th className="long-text">Enrolled Courses</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{classroomDetails.classroomid}</td>
                                <td>{classroomDetails.classroomname}</td>
                                <td className="long-text">{classroomDetails.enrolledcourses}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {classroomList.length > 0 && (
                <div className="classroom-list">
                    <h2>Classroom List</h2>
                    <div className="table-container">
                        <table className="classroom-table">
                            <thead>
                            <tr>
                                <th>Classroom ID</th>
                                <th>Classroom Name</th>
                                <th className="long-text">Enrolled Courses</th>
                            </tr>
                            </thead>
                            <tbody>
                            {classroomList.map((classroom, index) => (
                                <tr key={index}>
                                    <td>{classroom.classroomid}</td>
                                    <td>{classroom.classroomname}</td>
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
