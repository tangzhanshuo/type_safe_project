import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetCoursesByStudentUsernameMessage extends AdminMessage {
    studentUsername: string;

    constructor(studentUsername: string) {
        super();
        this.studentUsername = studentUsername;
    }
}
