import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserFindMessage extends UserMessage {
    usertype: string;
    username: string;

    constructor(usertype: string, username: string) {
        super();
        this.usertype = usertype;
        this.username = username;
    }
}
