import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { ArrowRightIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { useLaravelReactI18n } from 'laravel-react-i18n';

const Home = () => {
    const { t } = useLaravelReactI18n();

    return (
        <>
            <Head title={`${t('Home')} - Full Stack Developer`} />

            <section className="section hero-section container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        {t('Hero Title Plain')} <br />
                        <span className='text-primary-gradient'>{t('Hero Title Highlight')}</span>
                    </h1>
                    <p className="hero-subtitle">
                        {t('Hero Subtitle')}
                    </p>

                    <div className="flex gap-sm justify-center">
                        <Link href="/proyectos" className="btn btn-primary">
                            {t('View Projects')} <ArrowRightIcon className="icon-sm ml-sm" />
                        </Link>
                        <a href="https://github.com/Yairu4439" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                            <CodeBracketIcon className="icon-sm mr-sm" />
                            GitHub
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};

Home.layout = page => <Layout children={page} />;

export default Home;
