import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetPlanMessage extends AdminMessage {
    planid: number;

    constructor(planid: number) {
        super();
        this.planid = planid;
    }
}
