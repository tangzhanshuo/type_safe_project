import { Message } from 'Plugins/MessageAPI/Message';

export abstract class AdminMessage extends Message {
    override serviceName: string = "Admin"

    constructor() {
        super();
    }
}