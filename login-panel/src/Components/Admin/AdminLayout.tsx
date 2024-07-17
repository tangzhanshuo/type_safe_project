import React, { ReactNode } from 'react';
import { DashboardLayout } from 'Components/DashboardLayout';
import { FaHome, FaBook, FaList, FaPlus, FaUsers, FaSearch, FaChalkboardTeacher, FaClipboardList } from 'react-icons/fa'

const adminMenuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: FaHome },
    { path: '/admin/userManagement', name: 'User Management', icon: FaUsers },
    { path: '/admin/course', name: 'Course Management', icon: FaBook, children: [
            { path: '/admin/course/addCourse', name: 'Add Course', icon: FaPlus },
            { path: '/admin/course/searchCourse', name: 'Search Course', icon: FaSearch }
        ]},
    { path: '/admin/classroom', name: 'Classroom Management', icon: FaChalkboardTeacher },
    { path: '/admin/application', name: 'Applications', icon: FaClipboardList },
];

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <DashboardLayout menuItems={adminMenuItems} role="admin">
            {children}
        </DashboardLayout>
    );
}