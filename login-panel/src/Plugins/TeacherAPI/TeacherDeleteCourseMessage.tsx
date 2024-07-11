import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage'

export class TeacherDeleteCourseMessage extends TeacherMessage {
    courseID: number;

    constructor(courseID: number) {
        super();
        this.courseID = courseID;
    }
}