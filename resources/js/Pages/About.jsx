import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { BriefcaseIcon, AcademicCapIcon, CpuChipIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function About() {
    const { t } = useLaravelReactI18n();



    return (
        <>
            <Head title={`${t('About')} - Yahir Umaña Arroyo`} />

            <section className="section container">
                <div className="about-hero">
                    <h1 className="section-title">{t('About')}</h1>
                    <p className="section-subtitle">
                        {t('Profile Description')}
                    </p>
                </div>

                <div className="about-grid">
                    {/* Experience Section */}
                    <div className="about-card">
                        <div className="card-header">
                            <BriefcaseIcon className="icon-sm text-highlight mr-sm" />
                            <h2 className="card-title">{t('Experience')}</h2>
                        </div>
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h3 className="timeline-title">Full Stack Developer</h3>
                                    <span className="timeline-meta">Design Soft S.A • 2 {t('Years')}</span>
                                    <p className="timeline-desc">
                                        {t('Design Soft Experience')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="about-card">
                        <div className="card-header">
                            <AcademicCapIcon className="icon-sm text-highlight mr-sm" />
                            <h2 className="card-title">{t('Education')}</h2>
                        </div>
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h3 className="timeline-title">Ingeniería en Sistemas</h3>
                                    <span className="timeline-meta">{t('UNA')}</span>
                                    <p className="timeline-desc">
                                        {t('UNA Education')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Experience Section (New) */}
                    <div className="about-card">
                        <div className="card-header">
                            <AcademicCapIcon className="icon-sm text-highlight mr-sm" />
                            <h2 className="card-title">{t('Academic Experience')}</h2>
                        </div>
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h3 className="timeline-title">{t('Tutor Position')}</h3>
                                    <span className="timeline-meta">{t('UNA')}</span>
                                    <p className="timeline-desc">
                                        {t('Academic Desc')}
                                    </p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h3 className="timeline-title">{t('Library Assistant')}</h3>
                                    <span className="timeline-meta">{t('UNA')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Certifications Section (New) */}
                    <div className="about-card full-width">
                        <div className="card-header">
                            <CheckBadgeIcon className="icon-sm text-highlight mr-sm" />
                            <h2 className="card-title">{t('Certifications')}</h2>
                        </div>
                        <div className="certificates-grid">

                            {/* Google Cybersecurity */}
                            <div className="certificate-item">
                                <div className="cert-icon google-icon">G</div>
                                <div className="cert-content">
                                    <h3 className="cert-title">{t('Google Cyber')}</h3>
                                    <span className="cert-issuer">{t('Google Issuer')} • 2022</span>
                                    <div className="cert-actions">
                                        <span className="cert-id">ID: ALR 3NQ D7R</span>
                                        <a href="https://learndigital.withgoogle.com/link/1nur091p2ww" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                                            {t('Verify Credential')}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Scrum Fundamentals */}
                            <div className="certificate-item">
                                <div className="cert-icon scrum-icon">S</div>
                                <div className="cert-content">
                                    <h3 className="cert-title">{t('Scrum Fund')}</h3>
                                    <span className="cert-issuer">{t('Scrum Issuer')} • 2023</span>
                                    <div className="cert-actions">
                                        <span className="cert-id">ID: 982476</span>
                                        <a href="https://www.scrumstudy.com/certification/verify" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                                            {t('Verify Credential')}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* UNA Mentorship (Recognition) */}
                            <div className="certificate-item">
                                <div className="cert-icon una-icon">U</div>
                                <div className="cert-content">
                                    <h3 className="cert-title">{t('UNA Mentorship Rec')}</h3>
                                    <span className="cert-issuer">{t('UNA Issuer')} • 2021</span>
                                    <a href="/certificates/Estrategia de Mentorías Académicas.pdf" target="_blank" className="btn btn-sm btn-outline mt-xs">
                                        {t('View Credential')}
                                    </a>
                                </div>
                            </div>

                            {/* UNA Mentorship (Training) */}
                            <div className="certificate-item">
                                <div className="cert-icon una-icon">U</div>
                                <div className="cert-content">
                                    <h3 className="cert-title">{t('UNA Mentorship Cap')}</h3>
                                    <span className="cert-issuer">{t('UNA Issuer')} • 2021</span>
                                    <a href="/certificates/capacitación de Mentorías Académicas.pdf" target="_blank" className="btn btn-sm btn-outline mt-xs">
                                        {t('View Credential')}
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Technical Skills Section (Grouped) */}
                    <div className="about-card full-width">
                        <div className="card-header">
                            <CpuChipIcon className="icon-sm text-highlight mr-sm" />
                            <h2 className="card-title">{t('Technical Skills')}</h2>
                        </div>
                        <div className="skills-grid-categories">
                            {/* Web & Software */}
                            <div className="skill-category">
                                <h3 className="skill-category-title">{t('Web Development')}</h3>
                                <div className="skills-container">
                                    {['JavaScript', 'Node.js', 'React', 'React Native', 'AJAX', 'ASP.NET', 'ASP.NET Web API', 'C#', 'Java', 'C', 'PHP', 'Laravel'].map(skill => (
                                        <div key={skill} className="skill-pill">
                                            <CheckBadgeIcon className="icon-xs" />
                                            <span>{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile & Tools */}
                            <div className="skill-category">
                                <h3 className="skill-category-title">{t('Mobile & Tools')}</h3>
                                <div className="skills-container">
                                    {['Android Studio', 'Git', 'Postman'].map(skill => (
                                        <div key={skill} className="skill-pill">
                                            <CheckBadgeIcon className="icon-xs" />
                                            <span>{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Systems */}
                            <div className="skill-category">
                                <h3 className="skill-category-title">{t('Systems & Networks')}</h3>
                                <div className="skills-container">
                                    {['Cisco (CCNA knowledge)', 'SQL / Database'].map(skill => (
                                        <div key={skill} className="skill-pill">
                                            <CheckBadgeIcon className="icon-xs" />
                                            <span>{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Soft Skills Section (New) */}
                    <div className="about-card full-width">
                        <div className="card-header">
                            <CheckBadgeIcon className="icon-sm text-highlight mr-sm" />
                            <h2 className="card-title">{t('Soft Skills')}</h2>
                        </div>
                        <div className="skills-container">
                            {[
                                'Leadership',
                                'Teamwork',
                                'Communication',
                                'Teaching',
                                'Improvement',
                                'Commitment'
                            ].map(skill => (
                                <div key={skill} className="skill-pill skill-pill-soft">
                                    <span>{t(skill)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

About.layout = page => <Layout children={page} />;
