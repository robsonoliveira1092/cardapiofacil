import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Cores Padrão (Dark/Modern)
    const [colors, setColors] = useState({
        PRIMARY: '#FF4500',
        ACCENT: '#FFD700',
        BACKGROUND_LIGHT: '#121212',
        BACKGROUND_DARK: '#1E1E1E',
        TEXT_LIGHT: '#FFFFFF',
        TEXT_DARK: '#F5F5F5',
        TEXT_MUTED: '#A0A0A0',
        SUCCESS: '#28A745',
        ERROR: '#DC3545',
        DANGER: '#DC3545',
        WARNING: '#FFC107',
    });

    const [logo, setLogo] = useState('');
    const [carouselImages, setCarouselImages] = useState([]);

    const updateTheme = (newColors) => {
        setColors(prev => ({ ...prev, ...newColors }));
    };

    const value = {
        colors,
        logo,
        setLogo,
        carouselImages,
        setCarouselImages,
        updateTheme
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};