import { API } from "Plugins/CommonUtils/API";
import Auth from "Plugins/CommonUtils/AuthState";

export abstract class Message extends API {
    usertype: string;
    username: string;
    password: string;

    constructor() {
        super();

        const { usertype, username, password } = Auth.getState();
        this.usertype = usertype;
        this.username = username;
        this.password = password;
    }
}