import { UserMessage } from 'Plugins/UserAPI/UserMessage';

export class UserSetInfoMessage extends UserMessage {
    usertype: string
    username: string
    info: object

    constructor(usertype: string, username: string, info: object) {
        super();
        this.usertype = usertype;
        this.username = username;
        this.info = info;
    }
}
