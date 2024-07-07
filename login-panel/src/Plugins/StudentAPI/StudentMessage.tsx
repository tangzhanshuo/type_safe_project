import { Message } from 'Plugins/MessageAPI/Message';

export abstract class StudentMessage extends Message {
    override serviceName: string = "Student"

    constructor() {
        super();
    }
}