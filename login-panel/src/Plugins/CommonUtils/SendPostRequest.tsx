import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import Auth from 'Plugins/CommonUtils/AuthState';

export class Response {
    isError: boolean;
    error: any;
    data: any;

    constructor() {
        this.isError = false;
        this.error = null;
        this.data = null;
    }
}

export const sendUnverifiedPostRequest = async (message: API) => {
    const returnResponse = new Response()
    try {
        const response = await axios.post(message.getURL(), JSON.stringify(message), {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response status:', response.status);
        console.log('Response body:', response.data);
        returnResponse.data = response.data
    } catch (error) {
        returnResponse.isError = true;
        if (isAxiosError(error)) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error;
                const index = errorMessage.toLowerCase().lastIndexOf("body:");
                const errorString = index !== -1 ? errorMessage.substring(index + 5).trim() : errorMessage;
                console.error('Error sending request:', errorMessage);
                console.error('Error string:', errorString);
                returnResponse.error = errorString
            } else {
                console.error('Error sending request:', error.message);
                returnResponse.error = error.message
            }
        } else {
            console.error('Unexpected error:', error);
        }
    }
    return returnResponse
};

export const sendPostRequest = async (message: API) => {
    const response = await sendUnverifiedPostRequest(message)
    if (response.isError && response.error === 'Invalid user') {
        const { setUsertype, setUsername, setToken } = Auth.getState();
        setUsertype('');
        setUsername('');
        setToken('');
    }
    return response
};