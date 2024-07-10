import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage'

export class TeacherDeleteCourseMessage extends TeacherMessage {
    courseID: number;
    courseName: string;
    teacherUsername: string;
    teacherName: string;
    capacity: number;

    constructor(courseID: number, courseName: string, teacherUsername: string, teacherName: string, capacity: number) {
        super();
        this.courseID = courseID;
        this.courseName = courseName;
        this.teacherUsername = teacherUsername;
        this.teacherName = teacherName;
        this.capacity = capacity;
    }
}