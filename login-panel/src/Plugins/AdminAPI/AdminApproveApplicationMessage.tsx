import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminApproveApplicationMessage extends AdminMessage {
    applicationID: string;

    constructor(applicationID: string) {
        super();
        this.applicationID = applicationID;
    }
}