import { StudentMessage } from 'Plugins/StudentAPI/StudentMessage';

export class StudentSetInfoMessage extends StudentMessage {
    override serviceName: string = "User"
    info: object

    constructor(info: object) {
        super();
        this.info = info;
    }
}
