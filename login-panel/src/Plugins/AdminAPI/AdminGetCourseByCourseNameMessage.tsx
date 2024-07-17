import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetCourseByCourseNameMessage extends AdminMessage {
    courseName: string;

    constructor(courseName: string) {
        super();
        this.courseName = courseName;
    }
}