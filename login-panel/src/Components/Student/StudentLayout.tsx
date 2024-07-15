import React, { ReactNode, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from 'Hooks/UseAuth';
import { ThemeContext } from 'Plugins/CommonUtils/ThemeContext';

interface StudentLayoutProps {
    children: ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
    const location = useLocation();
    useAuth('student');
    const { toggleDarkMode } = useContext(ThemeContext);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-md overflow-y-auto">
                <div className="p-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Student Portal</h2>
                </div>
                <nav className="mt-4">
                    <Link
                        to="/student/dashboard"
                        className={`block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                            location.pathname === '/student/dashboard' ? 'bg-gray-200 dark:bg-gray-700' : ''
                        }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/student/courses"
                        className={`block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                            location.pathname === '/student/courses' ? 'bg-gray-200 dark:bg-gray-700' : ''
                        }`}
                    >
                        Courses
                    </Link>
                    <Link
                        to="/student/profile"
                        className={`block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                            location.pathname === '/student/profile' ? 'bg-gray-200 dark:bg-gray-700' : ''
                        }`}
                    >
                        Profile
                    </Link>
                </nav>
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
                            <span className="dark:hidden">🌙</span>
                            <span className="hidden dark:inline">☀️</span>
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