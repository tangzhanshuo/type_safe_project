import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage'

export class TeacherAddCourseMessage extends TeacherMessage {
    courseName: string;
    teacherName: string;
    capacity: number;
    info: string;
    courseHour: number[];
    classroomID: number;
    credits: number;

    constructor(courseName: string, teacherName: string, capacity: number, info: string, courseHour: number[],
                classroomID: number,
                credits: number,) {
        super();
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.capacity = capacity;
        this.info = info;
        this.courseHour = courseHour;
        this.classroomID = classroomID;
        this.credits = credits;
    }
}