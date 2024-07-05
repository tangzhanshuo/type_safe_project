import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserFindMessage extends UserMessage {
    userType: string;
    userName: string;

    constructor(userType: string, userName: string) {
        super();
        this.userType = userType;
        this.userName = userName;
    }
}
