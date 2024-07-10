import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddStudent2CourseMessage extends AdminMessage {
    courseID: number;
    studentUsername: string;
    priority: number;

    constructor(courseID: number, studentUsername: string, priority: number) {
        super();
        this.courseID = courseID;
        this.studentUsername = studentUsername;
        this.priority = priority;
    }
}
