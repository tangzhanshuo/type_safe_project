import React, { ReactNode, useContext, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from 'Hooks/UseAuth';
import { ThemeContext } from 'Plugins/CommonUtils/ThemeContext';
import { FaSignOutAlt, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { logout } from "Plugins/CommonUtils/UserManager";
import { IconType } from 'react-icons';

interface MenuItem {
    path?: string;
    name: string;
    icon: IconType;
    subItems?: MenuItem[];
}

interface DashboardLayoutProps {
    children: ReactNode;
    menuItems: MenuItem[];
    role: 'student' | 'teacher' | 'admin';
}

function SidebarItem({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const isActive = item.path ? location.pathname === item.path : false;

    const toggleExpand = (e: React.MouseEvent) => {
        if (item.subItems) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        }
    };

    const content = (
        <>
            <item.icon className="mr-3" />
            <span>{item.name}</span>
            {item.subItems && (
                <span className="ml-auto">
                    {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                </span>
            )}
        </>
    );

    const commonClasses = `flex items-center py-3 px-6 cursor-pointer text-blue-100 dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-gray-700 transition-colors duration-200 ${
        isActive ? 'bg-blue-600 dark:bg-gray-700' : ''
    }`;

    return (
        <>
            {item.subItems ? (
                <div
                    className={commonClasses}
                    style={{ paddingLeft: `${depth * 1.5 + 1.5}rem` }}
                    onClick={toggleExpand}
                >
                    {content}
                </div>
            ) : item.path ? (
                <Link
                    to={item.path}
                    className={commonClasses}
                    style={{ paddingLeft: `${depth * 1.5 + 1.5}rem` }}
                >
                    {content}
                </Link>
            ) : (
                <div
                    className={commonClasses}
                    style={{ paddingLeft: `${depth * 1.5 + 1.5}rem` }}
                >
                    {content}
                </div>
            )}
            {isExpanded && item.subItems && (
                <div>
                    {item.subItems.map((subItem, index) => (
                        <SidebarItem key={subItem.path || `${item.name}-${index}`} item={subItem} depth={depth + 1} />
                    ))}
                </div>
            )}
        </>
    );
}

export function DashboardLayout({ children, menuItems, role }: DashboardLayoutProps) {
    const { toggleDarkMode } = useContext(ThemeContext);
    const history = useHistory();
    const location = useLocation();
    useAuth(role);

    const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-500 to-blue-700 dark:from-gray-800 dark:to-gray-900 shadow-md overflow-y-auto flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-white">{capitalizedRole} Portal</h2>
                </div>

                <nav className="mt-6 flex-grow">
                    {menuItems.map((item, index) => (
                        <SidebarItem key={item.path || `${item.name}-${index}`} item={item} />
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