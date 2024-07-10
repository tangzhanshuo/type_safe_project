import { StudentMessage } from 'Plugins/StudentAPI/StudentMessage';

export class StudentAddApplicationMessage extends StudentMessage {
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