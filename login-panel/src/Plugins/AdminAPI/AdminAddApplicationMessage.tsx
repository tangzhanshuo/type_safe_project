import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddApplicationMessage extends AdminMessage {
    applicationType: string;
    info: string;
    approver: string;

    constructor(applicationType: string, info: string, approver: string) {
        super();
        this.applicationType = applicationType;
        this.info = info;
        this.approver = approver;
    }
}