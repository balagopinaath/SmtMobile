import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './helper';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Get system theme
    const systemTheme = useColorScheme();

    // State to hold the current theme
    const [theme, setTheme] = useState(systemTheme === 'dark' ? darkTheme : lightTheme);

    // Effect to update theme if system preference changes
    useEffect(() => {
        setTheme(systemTheme === 'dark' ? darkTheme : lightTheme);
    }, [systemTheme]);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);