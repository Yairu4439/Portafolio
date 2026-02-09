import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/Contexts/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-outline btn-sm ml-sm"
            aria-label="Toggle Theme"
            style={{ padding: '0.4rem 0.6rem' }}
        >
            {theme === 'dark' ? (
                <SunIcon className="icon-xs" style={{ width: '1.2rem', height: '1.2rem' }} />
            ) : (
                <MoonIcon className="icon-xs" style={{ width: '1.2rem', height: '1.2rem' }} />
            )}
        </button>
    );
};

export default ThemeToggle;
