import React from 'react';
import { BaseApplicationPage } from 'Components/BaseApplicationPage';
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { AdminGetApplicationFromApproverMessage } from 'Plugins/AdminAPI/AdminGetApplicationFromApproverMessage';
import { AdminDeleteApplicationMessage } from 'Plugins/AdminAPI/AdminDeleteApplicationMessage';
import { AdminApproveApplicationMessage } from 'Plugins/AdminAPI/AdminApproveApplicationMessage';
import { AdminRejectApplicationMessage } from 'Plugins/AdminAPI/AdminRejectApplicationMessage';
import { sendPostRequest, sendApplicationListRequest } from 'Plugins/CommonUtils/SendPostRequest';

export const AdminApplication: React.FC = () => {
    const getApplications = async () => {
        const message = new AdminGetApplicationFromApproverMessage();
        const response = await sendApplicationListRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to retrieve applications');
        return response.data;
    };

    const deleteApplication = async (applicationID: string) => {
        const message = new AdminDeleteApplicationMessage(applicationID);
        const response = await sendPostRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to delete application');
    };

    const approveApplication = async (applicationID: string) => {
        const message = new AdminApproveApplicationMessage(applicationID);
        const response = await sendPostRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to approve application');
    };

    const rejectApplication = async (applicationID: string) => {
        const message = new AdminRejectApplicationMessage(applicationID);
        const response = await sendPostRequest(message);
        if (response.isError) throw new Error(response.error || 'Failed to reject application');
    };



    return (
        <BaseApplicationPage
            userType="admin"
            getApplications={getApplications}
            deleteApplication={deleteApplication}
            approveApplication={approveApplication}
            rejectApplication={rejectApplication}
            showApproveReject={true}
            Layout={AdminLayout}
            isOwnApplications={false}
        />
    );
};