import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminUpdateCourseMessage extends AdminMessage {
    courseID: number;
    courseName?: string;
    teacherUsername?: string;
    teacherName?: string;
    capacity?: number;
    info?: string;
    courseHourJson?: string; // JSON represented as String
    classroomID?: number;
    credits?: number;
    enrolledStudentsJson?: string; // JSON represented as String
    kwargsJson?: string; // JSON represented as String

    constructor(
        courseID: number,
        courseName?: string,
        teacherUsername?: string,
        teacherName?: string,
        capacity?: number,
        info?: string,
        courseHourJson?: string,
        classroomID?: number,
        credits?: number,
        enrolledStudentsJson?: string,
        kwargsJson?: string
    ) {
        super();
        this.courseID = courseID;
        this.courseName = courseName;
        this.teacherUsername = teacherUsername;
        this.teacherName = teacherName;
        this.capacity = capacity;
        this.info = info;
        this.courseHourJson = courseHourJson;
        this.classroomID = classroomID;
        this.credits = credits;
        this.enrolledStudentsJson = enrolledStudentsJson;
        this.kwargsJson = kwargsJson;
    }
}