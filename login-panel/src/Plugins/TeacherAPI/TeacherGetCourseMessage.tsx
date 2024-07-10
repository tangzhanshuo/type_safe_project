import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage';

export class TeacherGetCourseMessage extends TeacherMessage {
    courseID: number;

    constructor(courseID: number) {
        super();
        this.courseID = courseID;
    }
}