import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { sendUserRequest } from 'Plugins/CommonUtils/UserManager';
import { ThemeContext } from 'Plugins/CommonUtils/ThemeContext';

export function Main() {
    const history = useHistory();
    const { toggleDarkMode } = useContext(ThemeContext);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 text-gray-900  dark:from-gray-800 dark:to-gray-900 dark:text-white">
            <header className="py-6 px-8 flex justify-between items-center bg-white bg-opacity-30 dark:bg-gray-800">
                <div className="flex items-center space-x-4">
                    <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
                    <h1 className="text-2xl font-bold">Course Selection System</h1>
                </div>
                <nav className="flex items-center">
                    <ul className="flex space-x-6 mr-6">
                        <li><a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-300">About</a></li>
                        <li><a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-300">Contact</a></li>
                        <li><a href="#help" className="hover:text-indigo-600 dark:hover:text-indigo-300">Help</a></li>
                    </ul>
                    <button
                        onClick={toggleDarkMode}
                        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
                    >
                        <span className="dark:hidden">🌙</span>
                        <span className="hidden dark:inline">☀️</span>
                    </button>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-12">
                <section className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Welcome to the Future of Course Selection</h2>
                    <p className="text-xl mb-8">Streamline your academic journey with our cutting-edge system</p>

                    <div className="flex justify-center space-x-6 mb-12">
                        <button onClick={() => history.push('/login/student')} className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105">
                            I'm a Student
                        </button>
                        <button onClick={() => history.push('/login/teacher')} className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105">
                            I'm a Teacher
                        </button>
                        <button onClick={() => history.push('/login/admin')} className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105">
                            I'm an Admin
                        </button>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white bg-opacity-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Intuitive Interface</h3>
                        <p>Navigate through courses with ease and efficiency</p>
                    </div>
                    <div className="bg-white bg-opacity-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Real-time Updates</h3>
                        <p>Stay informed with instant notifications and changes</p>
                    </div>
                    <div className="bg-white bg-opacity-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Smart Recommendations</h3>
                        <p>Get personalized course suggestions based on your profile</p>
                    </div>
                </section>

                <section className="text-center mb-16">
                    <h3 className="text-2xl font-bold mb-4">Experience the Future of Education</h3>
                    <button className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full">
                        Take a Tour
                    </button>
                </section>

                <div className="text-center">
                    <button
                        onClick={() => {
                            sendUserRequest("register","admin","a","a");
                            sendUserRequest("register","teacher","a","a");
                            sendUserRequest("register","student","a","a");
                        }}
                        className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Register test accounts
                    </button>
                </div>
            </main>

            <footer className="bg-white bg-opacity-30 dark:bg-gray-700 py-8 px-4">
                <div className="container mx-auto flex flex-wrap justify-between items-center">
                    <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
                        <h4 className="text-lg font-semibold mb-2">Course Selection System</h4>
                        <p>&copy; 2024 All Rights Reserved</p>
                    </div>
                    <div className="w-full md:w-1/3 text-center mb-4 md:mb-0">
                        <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
                        <ul>
                            <li><a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-300">About</a></li>
                            <li><a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-300">Contact</a></li>
                            <li><a href="#privacy" className="hover:text-indigo-600 dark:hover:text-indigo-300">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="w-full md:w-1/3 text-center md:text-right">
                        <h4 className="text-lg font-semibold mb-2">Connect With Us</h4>
                        <div className="flex justify-center md:justify-end space-x-4">
                            <a href="#" className="text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"><i className="fab fa-facebook"></i></a>
                            <a href="#" className="text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}