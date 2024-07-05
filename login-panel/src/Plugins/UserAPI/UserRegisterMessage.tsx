import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserRegisterMessage extends UserMessage {
    userType: string;
    userName: string;
    password: string;

    constructor(userType: string, userName: string, password: string) {
        super();
        this.userType = userType;
        this.userName = userName;
        this.password = password;
    }
}
