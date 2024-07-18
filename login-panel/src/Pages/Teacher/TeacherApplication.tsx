import React from 'react';
import { BaseApplicationPage } from 'Components/BaseApplicationPage';
import { TeacherLayout } from 'Components/Teacher/TeacherLayout';
import { TeacherGetApplicationFromApproverMessage } from 'Plugins/TeacherAPI/TeacherGetApplicationFromApproverMessage';
import { TeacherApproveApplicationMessage } from 'Plugins/TeacherAPI/TeacherApproveApplicationMessage';
import { TeacherRejectApplicationMessage } from 'Plugins/TeacherAPI/TeacherRejectApplicationMessage';
import { sendPostRequest, sendApplicationListRequest } from 'Plugins/CommonUtils/SendPostRequest';

export const TeacherApplication: React.FC = () => {
    const getApplications = async () => {
        const message = new TeacherGetApplicationFromApproverMessage();
        const response = await sendApplicationListRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to retrieve applications');
        return response.data;
    };

    const approveApplication = async (applicationID: string) => {
        const message = new TeacherApproveApplicationMessage(applicationID);
        const response = await sendPostRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to approve application');
    };

    const rejectApplication = async (applicationID: string) => {
        const message = new TeacherRejectApplicationMessage(applicationID);
        const response = await sendPostRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to reject application');
    };

    return (
        <BaseApplicationPage
            userType="teacher"
            getApplications={getApplications}
            approveApplication={approveApplication}
            rejectApplication={rejectApplication}
            showApproveReject={true}
            Layout={TeacherLayout}
            isOwnApplications={false}
        />
    );
};