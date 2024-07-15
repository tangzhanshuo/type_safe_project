import { UserLoginMessage } from 'Plugins/UserAPI/UserLoginMessage';
import { UserRegisterMessage } from 'Plugins/UserAPI/UserRegisterMessage';
import { UserDeleteMessage } from 'Plugins/UserAPI/UserDeleteMessage';
import { UserUpdateMessage } from 'Plugins/UserAPI/UserUpdateMessage';
import { sendUnverifiedPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { History } from 'history';
import Auth from 'Plugins/CommonUtils/AuthState';
import { Response } from 'Plugins/CommonUtils/SendPostRequest';

export const sendUserRequest = async (messageType: string, usertype: string, username: string, password: string, setFoundPassword?: (password: string) => void) => {
    const response = new Response();
    if (!usertype || !username) {
        response.isError = true;
        response.error = 'Some required fields are missing';
        return response
    }
    switch (messageType) {
        case "login":
            const loginResponse = await sendUnverifiedPostRequest(new UserLoginMessage(usertype, username, password));
            if (!loginResponse.isError && loginResponse.data.includes('Valid user')) {
                const token = loginResponse.data.split("Token:")[1].trim();
                console.log(token);
                Auth.getState().setUsertype(usertype);
                Auth.getState().setUsername(username);
                Auth.getState().setToken(token);
            }
            return loginResponse
        case "register":
            return await sendUnverifiedPostRequest(new UserRegisterMessage(usertype, username, password));
        case "delete":
            return await sendUnverifiedPostRequest(new UserDeleteMessage(usertype, username, password));
        case "update":
            return await sendUnverifiedPostRequest(new UserUpdateMessage(usertype, username, password));
    }
};

export const logout = (history: History) => {
    Auth.getState().setUsertype('');
    Auth.getState().setUsername('');
    Auth.getState().setToken('');
    history.push('/')
}