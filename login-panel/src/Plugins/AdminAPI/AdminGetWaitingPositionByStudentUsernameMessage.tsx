import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetWaitingPositionByStudentUsernameMessage extends AdminMessage {
    studentUsername: string;

    constructor(studentUsername: string) {
        super();
        this.studentUsername = studentUsername;
    }
}
