import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage';

export class TeacherApproveApplicationMessage extends TeacherMessage {
    applicationID: string;

    constructor(applicationID: string) {
        super();
        this.applicationID = applicationID;
    }
}