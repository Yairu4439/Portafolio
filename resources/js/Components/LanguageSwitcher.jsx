import React from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function LanguageSwitcher() {
    const { currentLocale, setLocale } = useLaravelReactI18n();

    const toggleLocale = () => {
        const newLocale = currentLocale() === 'es' ? 'en' : 'es';
        setLocale(newLocale);
    };

    return (
        <button
            onClick={toggleLocale}
            className="btn btn-outline btn-sm ml-sm"
            aria-label="Toggle Language"
        >
            {currentLocale() === 'es' ? 'EN' : 'ES'}
        </button>
    );
}
