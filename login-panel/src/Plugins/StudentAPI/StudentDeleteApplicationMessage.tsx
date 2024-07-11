import { StudentMessage } from 'Plugins/StudentAPI/StudentMessage';

export class StudentDeleteApplicationMessage extends StudentMessage {
    applicationID: string;

    constructor(applicationID: string) {
        super();
        this.applicationID = applicationID;
    }
}