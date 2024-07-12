import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetCourseByStudentUsernameMessage extends AdminMessage {
    studentUsername: string;

    constructor(studentUsername: string) {
        super();
        this.studentUsername = studentUsername;
    }
}
