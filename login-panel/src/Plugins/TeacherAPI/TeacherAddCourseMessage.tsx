import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage'

export class TeacherAddCourseMessage extends TeacherMessage {
    courseName: string;
    capacity: number;
    info: string;
    courseHour: number[];
    classroomID: number;
    credits: number;

    constructor(courseName: string, capacity: number, info: string, courseHour: number[],
                classroomID: number,
                credits: number,) {
        super();
        this.courseName = courseName;
        this.capacity = capacity;
        this.info = info;
        this.courseHour = courseHour;
        this.classroomID = classroomID;
        this.credits = credits;
    }
}