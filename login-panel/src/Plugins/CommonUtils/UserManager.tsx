import { UserLoginMessage } from 'Plugins/UserAPI/UserLoginMessage';
import { UserRegisterMessage } from 'Plugins/UserAPI/UserRegisterMessage';
import { UserDeleteMessage } from 'Plugins/UserAPI/UserDeleteMessage';
import { UserUpdateMessage } from 'Plugins/UserAPI/UserUpdateMessage';
import { UserFindMessage } from 'Plugins/UserAPI/UserFindMessage';
import { sendUserPostRequest } from 'Plugins/CommonUtils/SendPostRequest';
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
            const loginResponse = await sendUserPostRequest(new UserLoginMessage(usertype, username, password));
            if (loginResponse.data === 'Valid user') {
                Auth.getState().setUsertype(usertype);
                Auth.getState().setUsername(username);
                Auth.getState().setPassword(password);
                return 'Login successful';
            }
            return 'Invalid user';
            break;
        case "register":
            await sendUserPostRequest(new UserRegisterMessage(usertype, username, password));
            break;
        case "delete":
            await sendUserPostRequest(new UserDeleteMessage(usertype, username, password));
            break;
        case "update":
            await sendUserPostRequest(new UserUpdateMessage(usertype, username, password));
            break;
        case "find":
            const response = await sendUserPostRequest(new UserFindMessage(usertype, username));
            if (setFoundPassword) setFoundPassword(response.data.password);
            break;
    }
    return '';
};