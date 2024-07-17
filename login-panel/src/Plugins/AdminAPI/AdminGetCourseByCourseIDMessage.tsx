import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetCourseByCourseIDMessage extends AdminMessage {
    courseID: number;

    constructor(courseID: number) {
        super();
        this.courseID = courseID;
    }
}
