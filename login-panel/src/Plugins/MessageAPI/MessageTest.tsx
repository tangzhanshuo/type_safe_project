import { Message } from 'Plugins/MessageAPI/Message';

export class MessageTest extends Message {
    override serviceName: string = "Test"

    constructor() {
        super();
    }
}