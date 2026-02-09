import './bootstrap';
import '../css/main.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import Layout from '@/Layouts/Layout';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

import { LaravelReactI18nProvider } from 'laravel-react-i18n';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')).then(module => {
        const page = module.default;
        page.layout = page.layout || (page => <Layout children={page} />);
        return module;
    }),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const files = import.meta.glob('../../lang/*.json');

        // Detect browser language, fallback to 'es'
        const browserLang = navigator.language?.split('-')[0] || 'es';
        const supportedLocales = ['es', 'en'];
        const initialLocale = supportedLocales.includes(browserLang) ? browserLang : 'es';

        root.render(
            <LaravelReactI18nProvider
                locale={initialLocale}
                fallbackLocale={'en'}
                files={files}
            >
                <App {...props} />
            </LaravelReactI18nProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
