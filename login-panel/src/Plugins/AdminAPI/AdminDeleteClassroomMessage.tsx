import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminDeleteClassroomMessage extends AdminMessage {
    classroomID: number;

    constructor(classroomID: number) {
        super();
        this.classroomID = classroomID;
    }
}
