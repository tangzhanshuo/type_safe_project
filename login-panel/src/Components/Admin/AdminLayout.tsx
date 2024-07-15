import React, { ReactNode, useContext } from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import { useAuth } from 'Hooks/UseAuth';
import { ThemeContext } from 'Plugins/CommonUtils/ThemeContext';
import { FaHome, FaUsers, FaBook, FaChalkboardTeacher, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import {logout} from "Plugins/CommonUtils/UserManager";

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation();
    useAuth('admin');
    const { toggleDarkMode } = useContext(ThemeContext);
    const history = useHistory();

    const menuItems = [
        { path: '/admin/dashboard', name: 'Dashboard', icon: FaHome },
        { path: '/admin/user', name: 'User Management', icon: FaUsers },
        { path: '/admin/course', name: 'Course Management', icon: FaBook },
        { path: '/admin/classroom', name: 'Classroom Management', icon: FaChalkboardTeacher },
        { path: '/admin/application', name: 'Applications', icon: FaClipboardList },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 dark:from-gray-800 dark:to-gray-900 shadow-md overflow-y-auto flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-white">Admin Portal</h2>
                </div>

                <nav className="mt-6 flex-grow">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center py-3 px-6 text-indigo-100 dark:text-gray-300 hover:bg-indigo-700 dark:hover:bg-gray-700 transition-colors duration-200 ${
                                location.pathname === item.path ? 'bg-indigo-700 dark:bg-gray-700' : ''
                            }`}
                        >
                            <item.icon className="mr-3" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Logout button */}
                <div className="p-6">
                    <button
                        onClick={() => logout(history)}
                        className="flex items-center w-full py-2 px-4 text-blue-100 dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-gray-700 transition-colors duration-200 rounded"
                    >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="ml-64 flex flex-col min-h-screen">
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()?.slice(1)}
                        </h1>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                        >
                            <span className="dark:hidden">☀️</span>
                            <span className="hidden dark:inline">🌙</span>
                        </button>
                    </div>
                </header>
                <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}