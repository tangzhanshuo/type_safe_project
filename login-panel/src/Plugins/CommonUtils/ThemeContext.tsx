import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleDarkMode: () => {},
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prevMode => !prevMode);
    }, []);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};