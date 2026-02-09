import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { DiffEditor } from '@monaco-editor/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import ComparatorToolbar from './Partials/ComparatorToolbar';
import { useCodeComparator } from '@/hooks/useCodeComparator';

export default function CodeComparator() {
    const { t } = useLaravelReactI18n();
    const [theme, setTheme] = useState('vs-dark');
    const [language, setLanguage] = useState('plaintext');
    const [originalCode, setOriginalCode] = useState('');
    const [modifiedCode, setModifiedCode] = useState('');

    const { handleEditorDidMount, detectLanguage, diffEditorRef } = useCodeComparator();
    const isMountedRef = useRef(true);
    const editorInstanceRef = useRef(null);

    // Cleanup on unmount - dispose editor before React unmounts to prevent race condition
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
            // Manually dispose the editor instance before React cleanup
            if (editorInstanceRef.current) {
                try {
                    editorInstanceRef.current.dispose();
                } catch (e) {
                    // Ignore disposal errors
                }
                editorInstanceRef.current = null;
            }
            if (diffEditorRef.current) {
                diffEditorRef.current = null;
            }
        };
    }, [diffEditorRef]);

    // Detectar el tema del sistema/app para ajustar Monaco
    useEffect(() => {
        const checkTheme = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            setTheme(isDark ? 'vs-dark' : 'light');
        };

        checkTheme();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    checkTheme();
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    }, []);




    const handleSwap = () => {
        if (!diffEditorRef.current) return;

        const originalEditor = diffEditorRef.current.getOriginalEditor();
        const modifiedEditor = diffEditorRef.current.getModifiedEditor();

        const originalModel = originalEditor?.getModel();
        const modifiedModel = modifiedEditor?.getModel();

        if (!originalModel || originalModel.isDisposed() ||
            !modifiedModel || modifiedModel.isDisposed()) return;

        // Get current values
        const originalVal = originalModel.getValue();
        const modifiedVal = modifiedModel.getValue();

        // Swap by directly setting model values
        originalModel.setValue(modifiedVal);
        modifiedModel.setValue(originalVal);

        // Also update React state for consistency
        setOriginalCode(modifiedVal);
        setModifiedCode(originalVal);
    };

    const handleClear = () => {
        // Clear Monaco editor models directly
        if (diffEditorRef.current) {
            const originalEditor = diffEditorRef.current.getOriginalEditor();
            const modifiedEditor = diffEditorRef.current.getModifiedEditor();

            if (originalEditor?.getModel() && !originalEditor.getModel().isDisposed()) {
                originalEditor.getModel().setValue('');
            }
            if (modifiedEditor?.getModel() && !modifiedEditor.getModel().isDisposed()) {
                modifiedEditor.getModel().setValue('');
            }
        }
        // Also update React state
        setOriginalCode('');
        setModifiedCode('');
        setLanguage('plaintext');
    };

    // Memoize options to prevent unnecessary re-initializations
    const editorOptions = React.useMemo(() => ({
        renderSideBySide: true,
        originalEditable: true,
        readOnly: false,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        padding: { top: 16 },
        glyphMargin: true, // Enable Glyph Margin for arrows
        renderValidationDecorations: 'off' // Disable error squiggles
    }), []);

    // Wrapped onMount to handle both Hook logic and Auto-detection listener
    const onMount = (editor, monaco) => {
        if (!isMountedRef.current) return;

        editorInstanceRef.current = editor;
        handleEditorDidMount(editor, monaco); // Hook logic (Ref, Decorations)

        const handleContentChange = (subEditor) => (e) => {
            // Safety: check if component is still mounted
            if (!isMountedRef.current) return;

            const model = subEditor.getModel();
            if (!model || model.isDisposed()) return;

            const code = subEditor.getValue();

            // Language detection (only on Original)
            if (subEditor === editor.getOriginalEditor() && code.length > 20) {
                const detected = detectLanguage(code);
                setLanguage(prevLang => {
                    if (detected !== 'plaintext' && detected !== prevLang) {
                        return detected;
                    }
                    return prevLang;
                });
            }

            // Scroll fix: If change is a paste (large content) and cursor is at bottom, reset to top
            // This prevents the "pasting sends me to bottom" annoyance
            const changes = e.changes;
            const isLargePaste = changes.some(c => c.text.split('\n').length > 5);

            if (isLargePaste) {
                // Use setTimeout to ensure it runs after the editor's default scroll behavior
                setTimeout(() => {
                    // Safety check: Ensure component is mounted and editor/model is not disposed
                    if (!isMountedRef.current) return;
                    if (subEditor.getModel() && !subEditor.getModel().isDisposed()) {
                        subEditor.setScrollTop(0);
                        subEditor.setPosition({ lineNumber: 1, column: 1 });
                        subEditor.revealLine(1);
                    }
                }, 100);
            }
        };

        // Listen for content changes in both editors
        editor.getOriginalEditor().onDidChangeModelContent(handleContentChange(editor.getOriginalEditor()));
        editor.getModifiedEditor().onDidChangeModelContent(handleContentChange(editor.getModifiedEditor()));
    };

    return (
        <>
            <Head title={`${t('Code Comparator')} - ${t('Projects')}`} />

            <section className="section comparator-section">
                <div className="comparator-header">
                    <div className="header-content">
                        <h1 className="header-title">{t('Code Comparator')}</h1>
                        <span className="header-separator">•</span>
                        <p className="header-subtitle">{t('Comparator Subtitle')}</p>
                    </div>
                </div>

                <div className="comparator-card flex-grow h-full">

                    <ComparatorToolbar
                        language={language}
                        onLanguageChange={setLanguage}
                        onSwap={handleSwap}
                        onClear={handleClear}
                        autoDetectActive={language !== 'plaintext'}
                    />

                    {/* Editor Container */}
                    <div className="comparator-editor-wrapper">
                        <DiffEditor
                            height="100%"
                            language={language}
                            original={originalCode}
                            modified={modifiedCode}
                            theme={theme}
                            onMount={onMount}
                            options={editorOptions}
                        />
                    </div>
                </div>

                <div className="text-center text-sm text-muted mt-md mb-lg">
                    <p>{t('Comparator Tip')}</p>
                </div>
            </section>
        </>
    );
}

CodeComparator.layout = page => <Layout children={page} />;
