import React from 'react';
import { BaseApplicationPage } from 'Components/BaseApplicationPage';
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';
import { TeacherGetApplicationFromApplicantMessage } from 'Plugins/TeacherAPI/TeacherGetApplicationFromApplicantMessage';
import { TeacherDeleteApplicationMessage } from 'Plugins/TeacherAPI/TeacherDeleteApplicationMessage';
import { sendPostRequest, sendApplicationListRequest } from 'Plugins/CommonUtils/SendPostRequest';

export const TeacherMyApplication: React.FC = () => {
    const getApplications = async () => {
        const message = new TeacherGetApplicationFromApplicantMessage();
        const response = await sendApplicationListRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to retrieve applications');
        return response.data;
    };

    const deleteApplication = async (applicationID: string) => {
        const message = new TeacherDeleteApplicationMessage(applicationID);
        const response = await sendPostRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to delete application');
    };

    return (
        <BaseApplicationPage
            userType="teacher"
            getApplications={getApplications}
            deleteApplication={deleteApplication}
            showApproveReject={false}
            Layout={TeacherLayout}
            isOwnApplications={true}
        />
    );
};