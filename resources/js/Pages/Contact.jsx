import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { EnvelopeIcon, MapPinIcon, PaperAirplaneIcon, UserIcon, AtSymbolIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Contact() {
    const { t } = useLaravelReactI18n();
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = `Portafolio Contact: ${formData.name}`;
        const body = `${t('Name')}: ${formData.name}\n${t('Email')}: ${formData.email}\n\n${t('Message')}:\n${formData.message}`;
        window.location.href = `mailto:yairu4499@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <>
            <Head title={`${t('Contact')} - Portafolio Profesional`} />

            <section className="section container">
                <div className="section-header">
                    <h1 className="section-title">{t('Contact Me')}</h1>
                    <p className="section-subtitle">
                        {t('Contact Subtitle')}
                    </p>
                </div>

                <div className="contact-container">
                    <div className="about-card">
                        <div className="card-header">
                            <h3 className="card-title">{t('Contact Info Title')}</h3>
                        </div>

                        <div className="contact-details flex-col gap-md">
                            <div className="info-item flex items-center gap-sm">
                                <div className="icon-box icon-box-primary">
                                    <EnvelopeIcon className="icon-sm text-highlight" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted contact-text-label">Email</p>
                                    <p className="text-main contact-text-value">yairu4499@gmail.com</p>
                                </div>
                            </div>

                            <div className="info-item flex items-center gap-sm">
                                <div className="icon-box icon-box-secondary">
                                    <MapPinIcon className="icon-sm text-highlight" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted contact-text-label">{t('Location')}</p>
                                    <p className="text-main contact-text-value">Heredia, Costa Rica</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-footer contact-separator">
                            <p className="text-muted text-sm">
                                {t('Available for Hire')}
                            </p>
                        </div>
                    </div>

                    <div className="about-card">
                        <div className="card-header">
                            <h3 className="card-title">{t('Send Message')}</h3>
                        </div>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">{t('Name')}</label>
                                <div className="input-group">
                                    <UserIcon className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={t('Name')}
                                        className="form-input with-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('Email')}</label>
                                <div className="input-group">
                                    <AtSymbolIcon className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder={t('Email')}
                                        className="form-input with-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('Message')}</label>
                                <div className="input-group">
                                    <ChatBubbleBottomCenterTextIcon className="input-icon textarea-icon" />
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder={t('Message')}
                                        className="form-textarea with-icon"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-full gap-sm">
                                {t('Send Message')} <PaperAirplaneIcon className="icon-xs" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

Contact.layout = page => <Layout children={page} />;
