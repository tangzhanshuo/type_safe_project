import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetApplicationFromIDMessage extends AdminMessage {
    applicationID: string;

    constructor(applicationID: string) {
        super();
        this.applicationID = applicationID;
    }
}