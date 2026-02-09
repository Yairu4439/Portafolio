import React from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { ArrowLeftIcon, ArrowsRightLeftIcon, TrashIcon, ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

const LANGUAGES = [
    { id: 'plaintext', name: 'Plain Text' },
    { id: 'css', name: 'CSS' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'json', name: 'JSON' },
    { id: 'php', name: 'PHP / Laravel (Blade)' },
    { id: 'python', name: 'Python' },
    { id: 'sql', name: 'SQL' },
    { id: 'html', name: 'HTML' },
];

export default function ComparatorToolbar({
    language,
    onLanguageChange,
    onSwap,
    onClear,
    autoDetectActive
}) {
    const { t } = useLaravelReactI18n();

    return (
        <div className="comparator-toolbar flex-wrap gap-y-sm">
            <div className="flex gap-md items-center">
                <span className="indicator indicator-original hidden sm:flex">
                    <span className="indicator-dot"></span> {t('Original')}
                </span>
                <span className="indicator indicator-modified hidden sm:flex">
                    <span className="indicator-dot"></span> {t('Modified')}
                </span>

                {/* Language Selector (Custom UI) */}
                <div className="language-select-wrapper ml-sm">
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="language-select"
                        title={t('Select Language')}
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.id} value={lang.id}>{lang.name}</option>
                        ))}
                    </select>
                    <ChevronDownIcon className="language-select-icon" />
                </div>

                {/* Auto-detect badge (Visual Feedback) */}
                {autoDetectActive && (
                    <span className="text-xs text-muted hidden md:flex items-center gap-1 transition-all duration-300">
                        <SparklesIcon className="icon-xs text-sky-400" /> Auto-detect active
                    </span>
                )}
            </div>

            <div className="actions flex gap-sm">
                <button onClick={onSwap} className="btn btn-sm btn-outline flex items-center gap-xs" title={t('Swap')}>
                    <ArrowsRightLeftIcon className="icon-xs" />
                    <span className="hidden sm:inline">{t('Swap')}</span>
                </button>
                <button onClick={onClear} className="btn btn-sm btn-outline flex items-center gap-xs text-red-500 hover:border-red-500" title={t('Clear')}>
                    <TrashIcon className="icon-xs" />
                    <span className="hidden sm:inline">{t('Clear')}</span>
                </button>
            </div>
        </div>
    );
}
