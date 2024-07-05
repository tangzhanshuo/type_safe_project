import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserDeleteMessage extends UserMessage {
    userType: string;
    userName: string;

    constructor(userType: string, userName: string, password: string) {
        super();
        this.userType = userType;
        this.userName = userName;
    }
}