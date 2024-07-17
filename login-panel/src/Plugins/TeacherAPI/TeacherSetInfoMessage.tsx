import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage';

export class TeacherSetInfoMessage extends TeacherMessage {
    override serviceName: string = "User"
    info: object

    constructor(info: object) {
        super();
        this.info = info;
    }
}
