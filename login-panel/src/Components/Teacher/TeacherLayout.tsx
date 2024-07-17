import React, { ReactNode } from 'react';
import { DashboardLayout } from 'Components/DashboardLayout';
import { FaHome, FaBook, FaList, FaPlus } from 'react-icons/fa'

const teacherMenuItems = [
    { path: '/teacher/dashboard', name: 'Dashboard', icon: FaHome },
    { path: '/teacher/myCourse', name: 'My courses', icon: FaBook },
    { path: '/teacher/addCourse', name: 'Add Course', icon: FaPlus },
    { path: '/teacher/courseList', name: 'Courses list', icon: FaList },
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