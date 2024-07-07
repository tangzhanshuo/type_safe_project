import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminDeleteCourseMessage extends AdminMessage {
    courseID: number;

    constructor(courseID: number) {
        super();
        this.courseID = courseID;
    }
}
