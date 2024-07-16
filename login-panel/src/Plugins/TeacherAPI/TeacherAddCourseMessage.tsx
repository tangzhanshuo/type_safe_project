import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage'

export class TeacherAddCourseMessage extends TeacherMessage {
    courseID: number;
    courseName: string;
    teacherName: string;
    capacity: number;
    info: string;
    courseHour: string;
    classroomID: number;
    credits: number;

    constructor(courseID: number, courseName: string, teacherName: string, capacity: number, info: string, courseHour: string,
                classroomID: number,
                credits: number,) {
        super();
        this.courseID = courseID;
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.capacity = capacity;
        this.info = info;
        this.courseHour = courseHour;
        this.classroomID = classroomID;
        this.credits = credits;
    }
}