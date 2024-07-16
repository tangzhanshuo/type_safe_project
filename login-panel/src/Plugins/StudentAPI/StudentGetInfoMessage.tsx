import { StudentMessage } from 'Plugins/StudentAPI/StudentMessage';

export class StudentGetInfoMessage extends StudentMessage {
    override serviceName: string = "User"

    constructor() {
        super();
    }
}
