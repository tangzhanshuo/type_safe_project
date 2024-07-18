import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddPlanMessage extends AdminMessage {
    planid: number;
    planName: string;

    constructor(
        planid: number,
        planName: string,
    ) {
        super();
        this.planid = planid;
        this.planName = planName;
    }
}
