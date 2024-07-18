import React from 'react';
import { BaseApplicationPage } from 'Components/BaseApplicationPage';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { StudentGetApplicationFromApplicantMessage } from 'Plugins/StudentAPI/StudentGetApplicationFromApplicantMessage';
import { StudentDeleteApplicationMessage } from 'Plugins/StudentAPI/StudentDeleteApplicationMessage';
import { sendPostRequest, sendApplicationListRequest } from 'Plugins/CommonUtils/SendPostRequest';

export const StudentMyApplication: React.FC = () => {
    const getApplications = async () => {
        const message = new StudentGetApplicationFromApplicantMessage();
        const response = await sendApplicationListRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to retrieve applications');
        return response.data;
    };

    const deleteApplication = async (applicationID: string) => {
        const message = new StudentDeleteApplicationMessage(applicationID);
        const response = await sendPostRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to delete application');
    };

    return (
        <BaseApplicationPage
            userType="student"
            getApplications={getApplications}
            deleteApplication={deleteApplication}
            showApproveReject={false}
            Layout={StudentLayout}
            isOwnApplications={true}
        />
    );
};