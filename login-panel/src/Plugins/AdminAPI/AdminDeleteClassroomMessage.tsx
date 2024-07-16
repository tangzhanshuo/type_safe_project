import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminDeleteClassroomMessage extends AdminMessage {
    classroomid: number;

    constructor(classroomid: number) {
        super();
        this.classroomid = classroomid;
    }
}
