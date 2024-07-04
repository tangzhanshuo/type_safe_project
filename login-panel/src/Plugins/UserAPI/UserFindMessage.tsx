import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserFindMessage extends UserMessage {
    userName: string;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}
