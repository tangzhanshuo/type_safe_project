import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';

export const sendPostRequest = async (message: API) => {
    try {
        const response = await axios.post(message.getURL(), JSON.stringify(message), {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response status:', response.status);
        console.log('Response body:', response.data);
        return response;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response && error.response.data) {
                console.error('Error sending request:', error.response.data);
            } else {
                console.error('Error sending request:', error.message);
            }
        } else {
            console.error('Unexpected error:', error);
        }
    }
};