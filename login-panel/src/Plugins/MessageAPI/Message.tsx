import { API } from "Plugins/CommonUtils/API";
import Auth from "Plugins/CommonUtils/AuthState";

export abstract class Message extends API {
    usertype: string;
    username: string;
    token: string;

    constructor() {
        super();

        const { usertype, username, token } = Auth.getState();
        this.usertype = usertype;
        this.username = username;
        this.token = token;
    }
}