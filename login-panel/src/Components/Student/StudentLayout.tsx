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
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-y-auto`}>
                <div className="p-4">
                    <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Student Portal</h2>
                </div>
                <nav className="mt-4">
                    <Link
                        to="/student/dashboard"
                        className={`block py-2 px-4 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} ${
                            location.pathname === '/student/dashboard' ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') : ''
                        }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/student/courses"
                        className={`block py-2 px-4 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} ${
                            location.pathname === '/student/courses' ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') : ''
                        }`}
                    >
                        Courses
                    </Link>
                    <Link
                        to="/student/profile"
                        className={`block py-2 px-4 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} ${
                            location.pathname === '/student/profile' ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') : ''
                        }`}
                    >
                        Profile
                    </Link>
                </nav>
            </div>

            {/* Main content */}
            <div className="ml-64 flex flex-col min-h-screen">
                <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()?.slice(1)}
                        </h1>
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500`}
                        >
                            {darkMode ? '☀️' : '🌙'}
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