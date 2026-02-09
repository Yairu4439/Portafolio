import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { HomeIcon, UserIcon, BriefcaseIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import ThemeToggle from '@/Components/ThemeToggle';
import ParticlesBackground from '@/Components/ParticlesBackground';
import { ThemeProvider } from '@/Contexts/ThemeContext';

export default function Layout({ children }) {
    const { url } = usePage();
    const { t } = useLaravelReactI18n();

    const navLinkClass = (path) =>
        `nav-link flex items-center gap-sm ${url === path || (path !== '/' && url.startsWith(path)) ? 'active' : ''}`;

    return (
        <ThemeProvider>
            <div className="app-container">
                <ParticlesBackground />
                <header className="main-header">
                    <div className="container header-content">
                        <Link href="/" className="logo">Portafolio</Link>
                        <nav className="main-nav items-center">
                            <Link href="/" className={navLinkClass('/')}>
                                <HomeIcon className="icon-xs" />
                                {t('Home')}
                            </Link>
                            <Link href="/sobre-mi" className={navLinkClass('/sobre-mi')}>
                                <UserIcon className="icon-xs" />
                                {t('About')}
                            </Link>
                            <Link href="/proyectos" className={navLinkClass('/proyectos')}>
                                <BriefcaseIcon className="icon-xs" />
                                {t('Projects')}
                            </Link>
                            <Link href="/contacto" className={navLinkClass('/contacto')}>
                                <EnvelopeIcon className="icon-xs" />
                                {t('Contact')}
                            </Link>
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </nav>
                    </div>
                </header>

                <main className="main-content">
                    {children}
                </main>

                <footer className="main-footer">
                    <div className="container">
                        <p className="text-sm text-muted">
                            &copy; {new Date().getFullYear()} Yahir Umaña Arroyo.
                            <span className="footer-separator"> • </span>
                            Built with Laravel & React.
                        </p>
                    </div>
                </footer>
            </div>
        </ThemeProvider>
    );
}
