import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminForceAddStudent2CourseMessage extends AdminMessage {
    courseid: number;
    studentUsername: string;

    constructor(courseid: number, studentUsername: string) {
        super();
        this.courseid = courseid;
        this.studentUsername = studentUsername;
    }
}
