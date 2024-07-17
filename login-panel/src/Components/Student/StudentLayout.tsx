import React, { ReactNode } from 'react';
import { DashboardLayout } from 'Components/DashboardLayout';
import { FaHome, FaBook, FaList } from 'react-icons/fa';

const studentMenuItems = [
    { path: '/student/dashboard', name: 'Dashboard', icon: FaHome },
    { path: '/student/myCourse', name: 'My Courses', icon: FaBook },
    { path: '/student/courseList', name: 'Courses List', icon: FaList },
];

interface StudentLayoutProps {
    children: ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
    return (
        <DashboardLayout menuItems={studentMenuItems} role="student">
            {children}
        </DashboardLayout>
    );
}