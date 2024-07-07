import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddStudent2CourseMessage extends AdminMessage {
    courseID: number;
    studentUsername: string;

    constructor(courseID: number, studentUsername: string) {
        super();
        this.courseID = courseID;
        this.studentUsername = studentUsername;
    }
}
