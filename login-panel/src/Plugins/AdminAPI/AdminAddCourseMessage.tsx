import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddCourseMessage extends AdminMessage {
    courseName: string;
    teacherUsername: string;
    teacherName: string;
    capacity: number;
    info: string;
    courseHour: number[];
    classroomid: number;
    credits: number;

    constructor(
        courseName: string,
        teacherUsername: string,
        teacherName: string,
        capacity: number,
        info: string,
        courseHour: number[],
        classroomid: number,
        credits: number,
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
    }
}
