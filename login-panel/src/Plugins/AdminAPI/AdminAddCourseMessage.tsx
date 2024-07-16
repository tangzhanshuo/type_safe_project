import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddCourseMessage extends AdminMessage {
    courseName: string;
    teacherUsername: string;
    teacherName: string;
    capacity: number;
    info: string;
    courseHour: string; //  represented as String
    classroomid: number;
    credits: number;
    enrolledStudents: string; //  represented as String
    allStudents: string; //  represented as String

    constructor(
        courseName: string,
        teacherUsername: string,
        teacherName: string,
        capacity: number,
        info: string,
        courseHour: string,
        classroomid: number,
        credits: number,
        enrolledStudents: string,
        allStudents: string
    ) {
        super();
        this.courseName = courseName;
        this.teacherUsername = teacherUsername;
        this.teacherName = teacherName;
        this.capacity = capacity;
        this.info = info;
        this.courseHour = courseHour;
        this.classroomid = classroomid;
        this.credits = credits;
        this.enrolledStudents = enrolledStudents;
        this.allStudents = allStudents;
    }
}
