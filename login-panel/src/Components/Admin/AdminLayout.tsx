import React, { useState, ReactNode, useContext } from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import { useAuth } from 'Hooks/UseAuth';
import { ThemeContext } from 'Plugins/CommonUtils/ThemeContext';
import { FaHome, FaUsers, FaBook, FaChalkboardTeacher, FaClipboardList, FaSignOutAlt, FaPlus, FaSearch } from 'react-icons/fa';
import {logout} from "Plugins/CommonUtils/UserManager";

interface AdminLayoutProps {
    children: ReactNode;
}

interface MenuItem {
    path: string;
    name: string;
    icon: React.ElementType;
    children?: MenuItem[];
    isOpen?: boolean;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation();
    useAuth('admin');
    const { toggleDarkMode } = useContext(ThemeContext);
    const history = useHistory();

    const [menuItems, setMenuItems] = useState<MenuItem[]>([
        { path: '/admin/dashboard', name: 'Dashboard', icon: FaHome },
        { path: '/admin/userManagement', name: 'User Management', icon: FaUsers },
        { path: '/admin/course', name: 'Course Management', icon: FaBook, children: [
                { path: '/admin/course/addCourse', name: 'Add Course', icon: FaPlus },
                { path: '/admin/course/searchCourse', name: 'Search Course', icon: FaSearch }
            ]},
        { path: '/admin/classroom', name: 'Classroom Management', icon: FaChalkboardTeacher },
        { path: '/admin/application', name: 'Applications', icon: FaClipboardList },
    ]);
    const [activeSubMenu, setActiveSubMenu] = useState<MenuItem | null>(null);

    const mainContentMarginLeft = activeSubMenu ? 'calc(64px + 64px)' : '64px';

    const renderActiveSubMenu = (menuItem: MenuItem) => {
        if (!menuItem.children || menuItem.children.length === 0) {
            return null;
        }
        return (
            <div className="sub-menu-column">
                {menuItem.children.map((subItem, index) => (
                    <Link
                        key={index}
                        to={subItem.path}
                        className="sub-menu-item"
                    >
                        {React.createElement(subItem.icon, { className: "mr-3" })}
                        {subItem.name}
                    </Link>
                ))}
            </div>
        );
    };

    const handleMenuItemClick = (item: MenuItem) => {
        if (item.children && item.children.length > 0) {
            setActiveSubMenu(item);
        } else {
            setActiveSubMenu(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Sidebar */}
            <div
                className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-500 to-blue-700 dark:from-gray-800 dark:to-gray-900 shadow-md overflow-y-auto flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-white">Admin Portal</h2>
                </div>

                <nav className="mt-6 flex-grow">
                    {menuItems.map((item) => (
                        <div key={item.path} className="menu-item-wrapper">
                            <Link
                                to={item.path}
                                className={`flex items-center py-3 px-6 text-blue-100 dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-gray-700 transition-colors duration-200 ${
                                    location.pathname === item.path ? 'bg-blue-600 dark:bg-gray-700' : ''
                                }`}
                                onClick={() => handleMenuItemClick(item)}
                            >
                                <item.icon className="mr-3" />
                                {item.name}
                                {item.children && item.children.length > 0 && (
                                    <span className="ml-auto">
                                        {/* Icon or indicator for sub-menu items */}
                                    </span>
                                )}
                            </Link>
                        </div>
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
                    {activeSubMenu && renderActiveSubMenu(activeSubMenu)}
                    {children}
                </main>
            </div>
        </div>
    );
}

