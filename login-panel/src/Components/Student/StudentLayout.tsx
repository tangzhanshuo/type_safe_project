import React, { ReactNode } from 'react';
import { DashboardLayout } from 'Components/DashboardLayout';
import { FaHome, FaBook, FaList, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';

const studentMenuItems = [
    { path: '/student/dashboard', name: 'Dashboard', icon: FaHome },
    { path: '/student/myCourse', name: 'My Courses', icon: FaBook },
    { path: '/student/courseList', name: 'Courses List', icon: FaList },
    { path: '/student/myApplication', name: 'Applications', icon: FaClipboardList },
    { path: '/student/curriculum', name: 'Curriculum', icon: FaCalendarAlt },
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
