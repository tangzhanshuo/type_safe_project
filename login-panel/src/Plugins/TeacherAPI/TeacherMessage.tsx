import { Message } from 'Plugins/MessageAPI/Message';

export abstract class TeacherMessage extends Message {
    override serviceName: string = "Teacher"

    constructor() {
        super();
    }
}