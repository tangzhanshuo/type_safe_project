import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserDeleteMessage extends UserMessage {
    usertype: string;
    username: string;

    constructor(usertype: string, username: string, password: string) {
        super();
        this.usertype = usertype;
        this.username = username;
    }
}