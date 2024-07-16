import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddStudent2CourseMessage extends AdminMessage {
    courseid: number;
    studentUsername: string;
    priority: number;

    constructor(courseid: number, studentUsername: string, priority: number) {
        super();
        this.courseid = courseid;
        this.studentUsername = studentUsername;
        this.priority = priority;
    }
}
