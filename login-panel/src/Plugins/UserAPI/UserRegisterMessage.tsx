import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserRegisterMessage extends UserMessage {
    usertype: string;
    username: string;
    password: string;

    constructor(usertype: string, username: string, password: string) {
        super();
        this.usertype = usertype;
        this.username = username;
        this.password = password;
    }
}
