import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetClassroomMessage extends AdminMessage {
    classroomID: number;

    constructor(classroomID: number) {
        super();
        this.classroomID = classroomID;
    }
}
