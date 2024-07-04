import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserDeleteMessage extends UserMessage {
    userName: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
    }
}