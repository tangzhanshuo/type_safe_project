import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminDeleteStudentFromCourseMessage extends AdminMessage {
    courseID: number;
    studentUsername: string;

    constructor(courseID: number, studentUsername: string) {
        super();
        this.courseID = courseID;
        this.studentUsername = studentUsername;
    }
}
