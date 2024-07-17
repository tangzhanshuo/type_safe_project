import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetCourseByTeacherUsernameMessage extends AdminMessage {
    teacherUsername: string;

    constructor(teacherUsername: string) {
        super();
        this.teacherUsername = teacherUsername;
    }
}