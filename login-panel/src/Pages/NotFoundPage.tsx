import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ThemeContext } from 'Plugins/CommonUtils/ThemeContext';

export function NotFoundPage() {
    const history = useHistory();
    const { toggleDarkMode } = useContext(ThemeContext);
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 text-gray-900 dark:from-gray-800 dark:to-gray-900 dark:text-white">
            <header className="py-6 px-8 flex justify-between items-center bg-white bg-opacity-30 dark:bg-gray-800">
                <div className="flex items-center space-x-4">
                    <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
                    <h1 className="text-2xl font-bold">Page Not Found ️</h1>
                </div>
                <button
                    onClick={toggleDarkMode}
                    className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
                >
                    <span className="dark:hidden">☀️</span>
                    <span className="hidden dark:inline">🌙</span>
                </button>
            </header>

            <main className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-5xl font-bold mb-4">🤣👉<span style={{fontSize: '8rem'}}>404</span>👈🤣</h1>
                <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist. How did you even get here?
                    🧐</p>
                <button onClick={() => history.push('/')}
                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105">
                    Go Back Home
                </button>
            </main>

            <footer className="bg-white bg-opacity-30 dark:bg-gray-700 py-8 px-4" >
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 Course Selection System. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}