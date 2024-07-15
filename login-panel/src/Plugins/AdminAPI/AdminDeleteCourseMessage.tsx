import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminDeleteCourseMessage extends AdminMessage {
    courseid: number;

    constructor(courseid: number) {
        super();
        this.courseid = courseid;
    }
}
