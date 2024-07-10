import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetAvailableClassroomByCapacityHourMessage extends AdminMessage {
    capacity: number;
    courseHourJson: string;

    constructor(capacity: number, courseHourJson: string) {
        super();
        this.capacity = capacity;
        this.courseHourJson = courseHourJson;
    }
}
