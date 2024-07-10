import { StudentMessage } from 'Plugins/StudentAPI/StudentMessage';

export class StudentGetCourseByUsernameMessage extends StudentMessage {
    studentUsername: String;

    constructor(studentUsername: String) {
        super();
        this.studentUsername = studentUsername;
    }
}
