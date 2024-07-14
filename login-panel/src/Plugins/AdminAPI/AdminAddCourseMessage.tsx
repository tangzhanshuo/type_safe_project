import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddCourseMessage extends AdminMessage {
    courseName: string;
    teacherUsername: string;
    teacherName: string;
    capacity: number;
    info: string;
    courseHourJson: string; // JSON represented as String
    classroomID: number;
    credits: number;
    enrolledStudentsJson: string; // JSON represented as String
    allStudentsJson: string; // JSON represented as String

    constructor(
        courseName: string,
        teacherUsername: string,
        teacherName: string,
        capacity: number,
        info: string,
        courseHourJson: string,
        classroomID: number,
        credits: number,
        enrolledStudentsJson: string,
        allStudentsJson: string
    ) {
        super();
        this.courseName = courseName;
        this.teacherUsername = teacherUsername;
        this.teacherName = teacherName;
        this.capacity = capacity;
        this.info = info;
        this.courseHourJson = courseHourJson;
        this.classroomID = classroomID;
        this.credits = credits;
        this.enrolledStudentsJson = enrolledStudentsJson;
        this.allStudentsJson = allStudentsJson;
    }
}
