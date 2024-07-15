import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Auth from 'Plugins/CommonUtils/AuthState';

type UserType = 'student' | 'teacher' | 'admin';

export function useAuth(requiredUserType: UserType) {
    const history = useHistory();

    useEffect(() => {
        const { usertype, username, token } = Auth.getState();

        if (!usertype || !username || !token) {
            // Redirect to login page
            history.push('/login');
        } else if (usertype !== requiredUserType) {
            // Redirect to appropriate page based on user type
            switch (usertype) {
                case 'student':
                    history.push('/student/dashboard');
                    break;
                case 'teacher':
                    history.push('/teacher/dashboard');
                    break;
                case 'admin':
                    history.push('/admin/dashboard');
                    break;
                default:
                    history.push('/');
            }
        }
    }, [history, requiredUserType]);
}