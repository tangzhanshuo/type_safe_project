import { UserLoginMessage } from 'Plugins/UserAPI/UserLoginMessage';
import { UserRegisterMessage } from 'Plugins/UserAPI/UserRegisterMessage';
import { UserDeleteMessage } from 'Plugins/UserAPI/UserDeleteMessage';
import { UserUpdateMessage } from 'Plugins/UserAPI/UserUpdateMessage';
import { sendUnverifiedPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
import { History } from 'history';
import Auth from 'Plugins/CommonUtils/AuthState';

export const sendUserRequest = async (messageType: string, usertype: string, username: string, password: string, setFoundPassword?: (password: string) => void) => {
    if (!usertype || !username) {
        return 'Some required fields are missing';
    }
    if (!password && messageType !== 'find') {
        return 'Password is required';
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
                return 'Login successful';
            }
            return 'Invalid user';
            break;
        case "register":
            await sendUnverifiedPostRequest(new UserRegisterMessage(usertype, username, password));
            break;
        case "delete":
            await sendUnverifiedPostRequest(new UserDeleteMessage(usertype, username, password));
            break;
        case "update":
            await sendUnverifiedPostRequest(new UserUpdateMessage(usertype, username, password));
            break;
    }
    return '';
};

export const logout = (history: History) => {
    Auth.getState().setUsertype('');
    Auth.getState().setUsername('');
    Auth.getState().setToken('');
    history.push('/')
}