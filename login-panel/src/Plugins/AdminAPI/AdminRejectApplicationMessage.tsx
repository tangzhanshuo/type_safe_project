import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminRejectApplicationMessage extends AdminMessage {
    applicationID: string;

    constructor(applicationID: string) {
        super();
        this.applicationID = applicationID;
    }
}