import React, { ReactNode } from 'react';
import { DashboardLayout } from 'Components/DashboardLayout';
import { FaHome, FaBook, FaList, FaPlus, FaClipboardList } from 'react-icons/fa'

const teacherMenuItems = [
    { path: '/teacher/dashboard', name: 'Dashboard', icon: FaHome },
    { path: '/teacher/myCourse', name: 'My courses', icon: FaBook },
    { path: '/teacher/addCourse', name: 'Add Course', icon: FaPlus },
    { path: '/teacher/myApplication', name: 'My Applications', icon: FaClipboardList },
    { path: '/teacher/application', name: 'Approve Applications', icon: FaClipboardList },
];

interface TeacherLayoutProps {
    children: ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
    return (
        <DashboardLayout menuItems={teacherMenuItems} role="teacher">
            {children}
        </DashboardLayout>
    );
}