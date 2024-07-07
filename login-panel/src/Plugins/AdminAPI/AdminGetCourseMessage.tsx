import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetCourseMessage extends AdminMessage {
    courseID: number;

    constructor(courseID: number) {
        super();
        this.courseID = courseID;
    }
}
