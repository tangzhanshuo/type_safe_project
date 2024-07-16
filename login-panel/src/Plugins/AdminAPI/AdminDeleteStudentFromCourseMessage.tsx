import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminDeleteStudentFromCourseMessage extends AdminMessage {
    courseid: number;
    studentUsername: string;

    constructor(courseid: number, studentUsername: string) {
        super();
        this.courseid = courseid;
        this.studentUsername = studentUsername;
    }
}
