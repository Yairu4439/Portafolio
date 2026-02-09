import { useRef, useCallback } from 'react';

/**
 * Language detection based on code content patterns
 * @param {string} code - The code to analyze
 * @returns {string} - Detected language identifier for Monaco
 */
const detectLanguage = (code) => {
    const trimmed = code.trim();
    if (!trimmed) return 'plaintext';

    // JavaScript/TypeScript detection FIRST (highest priority)
    // These patterns are very specific to JS/TS
    if (trimmed.includes('import ') && trimmed.includes('from ') ||
        trimmed.includes('export default') ||
        trimmed.includes('export function') ||
        trimmed.includes('export const') ||
        trimmed.includes('const ') && trimmed.includes('=>') ||
        trimmed.includes('require(') ||
        trimmed.includes('module.exports') ||
        trimmed.includes('useRef') ||
        trimmed.includes('useState') ||
        trimmed.includes('useEffect') ||
        trimmed.includes('useCallback') ||
        trimmed.includes('className=') ||
        trimmed.includes('React.')) {
        return 'javascript';
    }

    // TypeScript specific
    if (trimmed.includes(': string') ||
        trimmed.includes(': number') ||
        trimmed.includes(': boolean') ||
        trimmed.includes('interface ') ||
        trimmed.includes('<T>')) {
        return 'typescript';
    }

    // PHP/Blade detection (must have PHP-specific markers)
    if (trimmed.startsWith('<?php') ||
        trimmed.includes('<?=') ||
        trimmed.includes('namespace App\\') ||
        trimmed.includes('use Illuminate\\') ||
        (trimmed.includes('@extends') && trimmed.includes('(\'')) ||
        (trimmed.includes('@section') && trimmed.includes('(\'')) ||
        trimmed.includes('$this->') ||
        trimmed.includes('{{') && trimmed.includes('}}')) {
        return 'php';
    }

    // HTML detection
    if (trimmed.includes('<!DOCTYPE') ||
        (trimmed.startsWith('<') && trimmed.includes('</') && !trimmed.includes('=>'))) {
        return 'html';
    }

    // JSON detection
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        return 'json';
    }

    // CSS detection
    if (trimmed.includes('{') && (trimmed.includes(':') && trimmed.includes(';'))) {
        return 'css';
    }

    // SQL detection
    const upper = trimmed.toUpperCase();
    if (upper.startsWith('SELECT ') ||
        upper.startsWith('INSERT ') ||
        upper.startsWith('UPDATE ') ||
        upper.startsWith('DELETE ') ||
        upper.includes('CREATE TABLE')) {
        return 'sql';
    }

    // Python detection
    if (trimmed.includes('def ') && trimmed.includes(':') ||
        trimmed.includes('import ') && !trimmed.includes('from \'') ||
        trimmed.startsWith('class ') && trimmed.includes(':')) {
        return 'python';
    }

    return 'plaintext';
};

/**
 * Validates and clamps a line number to valid bounds
 * @param {number} line - The line number to validate
 * @param {number} maxLine - Maximum valid line number
 * @returns {number} - Valid line number within bounds
 */
const clampLineNumber = (line, maxLine) => {
    if (line < 1) return 1;
    if (line > maxLine) return maxLine;
    return line;
};

/**
 * Checks if a model is empty or effectively empty
 * @param {object} model - Monaco editor model
 * @param {number} lineCount - Number of lines in model
 * @returns {boolean} - True if model is empty
 */
const isModelEmpty = (model, lineCount) => {
    return lineCount === 0 || (lineCount === 1 && model.getValue().trim() === '');
};

/**
 * Custom hook for Code Comparator functionality
 * Provides bidirectional merge arrows and language detection
 */
export function useCodeComparator() {
    const diffEditorRef = useRef(null);
    const monacoRef = useRef(null);

    /**
     * Clears decorations with a specific class name from an editor
     */
    const clearDecorations = useCallback((editor, className) => {
        const model = editor?.getModel();
        if (!model || model.isDisposed()) return;

        const oldDecorations = model.getAllDecorations()
            .filter(d => d.options?.glyphMarginClassName === className)
            .map(d => d.id);

        if (oldDecorations.length > 0) {
            editor.deltaDecorations(oldDecorations, []);
        }
    }, []);

    /**
     * Applies new decorations to an editor, replacing old ones with same class
     */
    const applyDecorations = useCallback((editor, decorations, className) => {
        const model = editor?.getModel();
        if (!model || model.isDisposed()) return;

        const oldDecorations = model.getAllDecorations()
            .filter(d => d.options?.glyphMarginClassName === className)
            .map(d => d.id);

        editor.deltaDecorations(oldDecorations, decorations);
    }, []);

    /**
     * Updates merge decorations for both editors (bidirectional arrows)
     */
    const updateMergeDecorations = useCallback(() => {
        const editor = diffEditorRef.current;
        const monacoInstance = monacoRef.current;
        if (!editor || !monacoInstance) return;

        const modifiedEditor = editor.getModifiedEditor();
        const originalEditor = editor.getOriginalEditor();

        const modifiedModel = modifiedEditor?.getModel();
        const originalModel = originalEditor?.getModel();

        // Safety checks for disposed models
        if (!modifiedModel || modifiedModel.isDisposed()) return;
        if (!originalModel || originalModel.isDisposed()) return;

        const changes = editor.getLineChanges();

        // Clear decorations if no changes exist
        if (!changes || changes.length === 0) {
            clearDecorations(modifiedEditor, 'merge-arrow-right');
            clearDecorations(originalEditor, 'merge-arrow-left');
            return;
        }

        const modifiedMaxLine = modifiedModel.getLineCount();
        const originalMaxLine = originalModel.getLineCount();

        // Skip if both editors are empty
        if (isModelEmpty(modifiedModel, modifiedMaxLine) &&
            isModelEmpty(originalModel, originalMaxLine)) {
            clearDecorations(modifiedEditor, 'merge-arrow-right');
            clearDecorations(originalEditor, 'merge-arrow-left');
            return;
        }

        const modifiedDecorations = [];
        const originalDecorations = [];

        changes.forEach(change => {
            // In Monaco diff:
            // - modifiedStartLine === 0 means lines were DELETED from original (don't exist in modified)
            // - originalStartLine === 0 means lines were INSERTED in modified (don't exist in original)

            // Merge Right arrow (←) on Modified editor - only if there's content in original to copy
            // Show arrow even for deletions (line 0) so user can restore deleted content
            if (!isModelEmpty(modifiedModel, modifiedMaxLine) && change.originalEndLine > 0) {
                // For deletions (modifiedStartLine === 0), place arrow at the insertion point
                // For modifications, place at the modified start line
                let modLine;
                if (change.modifiedStartLine === 0) {
                    // This was a deletion - place near where content would be inserted
                    modLine = clampLineNumber(change.modifiedEndLine || 1, modifiedMaxLine);
                } else {
                    modLine = clampLineNumber(change.modifiedStartLine, modifiedMaxLine);
                }

                modifiedDecorations.push({
                    range: new monacoInstance.Range(modLine, 1, modLine, 1),
                    options: {
                        isWholeLine: false,
                        glyphMarginClassName: 'merge-arrow-right',
                        glyphMarginHoverMessage: { value: '← Copiar desde Original' }
                    }
                });
            }

            // Merge Left arrow (→) on Original editor - only if there's content in modified to copy
            // Show arrow even for insertions (line 0) so user can copy new content
            if (!isModelEmpty(originalModel, originalMaxLine) && change.modifiedEndLine > 0) {
                // For insertions (originalStartLine === 0), place arrow near insertion point
                // For modifications, place at the original start line
                let origLine;
                if (change.originalStartLine === 0) {
                    // This was an insertion - place near where content would be inserted
                    origLine = clampLineNumber(change.originalEndLine || 1, originalMaxLine);
                } else {
                    origLine = clampLineNumber(change.originalStartLine, originalMaxLine);
                }

                originalDecorations.push({
                    range: new monacoInstance.Range(origLine, 1, origLine, 1),
                    options: {
                        isWholeLine: false,
                        glyphMarginClassName: 'merge-arrow-left',
                        glyphMarginHoverMessage: { value: '→ Copiar desde Modificado' }
                    }
                });
            }
        });

        // Apply decorations to both editors
        applyDecorations(modifiedEditor, modifiedDecorations, 'merge-arrow-right');
        applyDecorations(originalEditor, originalDecorations, 'merge-arrow-left');
    }, [clearDecorations, applyDecorations]);

    /**
     * Executes a merge operation from source to target editor
     */
    const executeMerge = useCallback((change, sourceEditor, targetEditor, monacoInstance, direction) => {
        const isRightMerge = direction === 'right'; // Original → Modified

        const sourceStart = isRightMerge ? change.originalStartLine : change.modifiedStartLine;
        const sourceEnd = isRightMerge ? change.originalEndLine : change.modifiedEndLine;
        const targetStart = isRightMerge ? change.modifiedStartLine : change.originalStartLine;
        const targetEnd = isRightMerge ? change.modifiedEndLine : change.originalEndLine;

        const replaceRange = new monacoInstance.Range(
            targetStart === 0 ? 1 : targetStart,
            1,
            targetEnd === 0 ? 1 : targetEnd,
            Number.MAX_SAFE_INTEGER
        );

        // Get text to insert from source
        let textToInsert = '';
        if (sourceEnd > 0) {
            textToInsert = sourceEditor.getModel().getValueInRange(
                new monacoInstance.Range(sourceStart, 1, sourceEnd, Number.MAX_SAFE_INTEGER)
            );
        }

        // Execute the appropriate edit operation
        if (sourceEnd === 0) {
            // Deletion: remove lines from target
            targetEditor.executeEdits('merge-tool', [{ range: replaceRange, text: '' }]);
        } else if (targetEnd === 0) {
            // Insertion: add lines to target
            const insertLine = targetStart === 0 ? 1 : targetStart;
            const insertPoint = new monacoInstance.Range(insertLine, 1, insertLine, 1);
            targetEditor.executeEdits('merge-tool', [{ range: insertPoint, text: textToInsert + '\n' }]);
        } else {
            // Replacement
            targetEditor.executeEdits('merge-tool', [{ range: replaceRange, text: textToInsert }]);
        }
    }, []);

    /**
     * Handles click on Modified editor glyph margin (Merge Right)
     */
    const handleMergeRight = useCallback((lineNumber) => {
        // Validate lineNumber
        if (!lineNumber || lineNumber < 1) return;

        const editor = diffEditorRef.current;
        const monacoInstance = monacoRef.current;
        if (!editor || !monacoInstance) return;

        const modifiedEditor = editor.getModifiedEditor();
        const originalEditor = editor.getOriginalEditor();

        if (!modifiedEditor?.getModel() || modifiedEditor.getModel().isDisposed() ||
            !originalEditor?.getModel() || originalEditor.getModel().isDisposed()) return;

        const changes = editor.getLineChanges();
        if (!changes || changes.length === 0) return;

        // Find the change that contains this line
        const change = changes.find(c => {
            const startLine = c.modifiedStartLine === 0 ? c.modifiedEndLine : c.modifiedStartLine;
            const endLine = c.modifiedEndLine === 0 ? c.modifiedStartLine : c.modifiedEndLine;
            return lineNumber >= Math.max(1, startLine) && lineNumber <= Math.max(1, endLine);
        });

        if (change) {
            executeMerge(change, originalEditor, modifiedEditor, monacoInstance, 'right');
        }
    }, [executeMerge]);

    /**
     * Handles click on Original editor glyph margin (Merge Left)
     */
    const handleMergeLeft = useCallback((lineNumber) => {
        // Validate lineNumber
        if (!lineNumber || lineNumber < 1) return;

        const editor = diffEditorRef.current;
        const monacoInstance = monacoRef.current;
        if (!editor || !monacoInstance) return;

        const modifiedEditor = editor.getModifiedEditor();
        const originalEditor = editor.getOriginalEditor();

        if (!modifiedEditor?.getModel() || modifiedEditor.getModel().isDisposed() ||
            !originalEditor?.getModel() || originalEditor.getModel().isDisposed()) return;

        const changes = editor.getLineChanges();
        if (!changes || changes.length === 0) return;

        // Find the change that contains this line
        const change = changes.find(c => {
            const startLine = c.originalStartLine === 0 ? c.originalEndLine : c.originalStartLine;
            const endLine = c.originalEndLine === 0 ? c.originalStartLine : c.originalEndLine;
            return lineNumber >= Math.max(1, startLine) && lineNumber <= Math.max(1, endLine);
        });

        if (change) {
            executeMerge(change, modifiedEditor, originalEditor, monacoInstance, 'left');
        }
    }, [executeMerge]);

    /**
     * Callback for when the DiffEditor is mounted
     * Sets up refs, decorations, and event listeners
     */
    const handleEditorDidMount = useCallback((editor, monacoInstance) => {
        diffEditorRef.current = editor;
        monacoRef.current = monacoInstance;

        // Initial decoration update
        updateMergeDecorations();

        // Listen for diff updates to refresh arrows
        editor.onDidUpdateDiff(updateMergeDecorations);

        // Click handler for Modified editor (Merge Right - ←)
        const modifiedEditor = editor.getModifiedEditor();
        modifiedEditor.onMouseDown((e) => {
            if (e.target.type === monacoInstance.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
                handleMergeRight(e.target.position?.lineNumber);
            }
        });

        // Click handler for Original editor (Merge Left - →)
        const originalEditor = editor.getOriginalEditor();
        originalEditor.onMouseDown((e) => {
            if (e.target.type === monacoInstance.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
                handleMergeLeft(e.target.position?.lineNumber);
            }
        });
    }, [updateMergeDecorations, handleMergeRight, handleMergeLeft]);

    return {
        handleEditorDidMount,
        detectLanguage,
        diffEditorRef
    };
}
