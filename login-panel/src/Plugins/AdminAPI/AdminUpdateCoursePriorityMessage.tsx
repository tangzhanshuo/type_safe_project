import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminUpdateCoursePriorityMessage extends AdminMessage {
    planid: number;
    year: number;
    courseid: number;
    priority: number;

    constructor(
                planid: number,
                year: number,
                courseid: number,
                priority: number
    ) {
        super();
        this.planid = planid;
        this.year = year;
        this.courseid = courseid;
        this.priority = priority;
    }
}
