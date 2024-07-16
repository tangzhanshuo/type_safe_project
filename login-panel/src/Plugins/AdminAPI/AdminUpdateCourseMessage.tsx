import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminUpdateCourseMessage extends AdminMessage {
    courseid: number;
    courseName?: string;
    teacherUsername?: string;
    teacherName?: string;
    capacity?: number;
    info?: string;
    courseHourJson?: string; // JSON represented as String
    classroomid?: number;
    credits?: number;
    enrolledStudentsJson?: string; // JSON represented as String
    allStudentsJson?: string; // JSON represented as String

    constructor(
        courseid: number,
        courseName?: string,
        teacherUsername?: string,
        teacherName?: string,
        capacity?: number,
        info?: string,
        courseHourJson?: string,
        classroomid?: number,
        credits?: number,
        enrolledStudentsJson?: string,
        allStudentsJson?: string
    ) {
        super();
        this.courseid = courseid;
        this.courseName = courseName;
        this.teacherUsername = teacherUsername;
        this.teacherName = teacherName;
        this.capacity = capacity;
        this.info = info;
        this.courseHourJson = courseHourJson;
        this.classroomid = classroomid;
        this.credits = credits;
        this.enrolledStudentsJson = enrolledStudentsJson;
        this.allStudentsJson = allStudentsJson;
    }
}
