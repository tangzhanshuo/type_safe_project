import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminReorderStudentsByCourseIDMessage extends AdminMessage {
    courseID: number;

    constructor(courseID: number) {
        super();
        this.courseID = courseID;
    }
}
