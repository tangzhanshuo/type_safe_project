import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage';

export class TeacherGetInfoMessage extends TeacherMessage {
    override serviceName: string = "User"

    constructor() {
        super();
    }
}
