import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    ListChecks,
    Quote,
    Minus,
    Link as LinkIcon,
    Image as ImageIcon,
    Highlighter,
    Undo,
    Redo,
    Paperclip,
    FileCode,
    Type
} from 'lucide-react';
import './RichTextEditor.css';

const lowlight = createLowlight(common);

// Slash Command Extension
const SlashCommands = [
    { title: 'Heading 1', command: 'h1', icon: Heading1, action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { title: 'Heading 2', command: 'h2', icon: Heading2, action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { title: 'Heading 3', command: 'h3', icon: Heading3, action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { title: 'Bullet List', command: 'bullet', icon: List, action: (editor) => editor.chain().focus().toggleBulletList().run() },
    { title: 'Numbered List', command: 'numbered', icon: ListOrdered, action: (editor) => editor.chain().focus().toggleOrderedList().run() },
    { title: 'Task List', command: 'todo', icon: ListChecks, action: (editor) => editor.chain().focus().toggleTaskList().run() },
    { title: 'Code Block', command: 'code', icon: FileCode, action: (editor) => editor.chain().focus().toggleCodeBlock().run() },
    { title: 'Blockquote', command: 'quote', icon: Quote, action: (editor) => editor.chain().focus().toggleBlockquote().run() },
    { title: 'Divider', command: 'divider', icon: Minus, action: (editor) => editor.chain().focus().setHorizontalRule().run() },
    { title: 'Bold', command: 'bold', icon: Bold, action: (editor) => editor.chain().focus().toggleBold().run() },
    { title: 'Italic', command: 'italic', icon: Italic, action: (editor) => editor.chain().focus().toggleItalic().run() },
    { title: 'Paragraph', command: 'text', icon: Type, action: (editor) => editor.chain().focus().setParagraph().run() },
];

// ─── Toolbar Button ──────────────────────────────────────────────
function ToolbarButton({ icon: Icon, label, isActive, onClick, disabled }) {
    return (
        <button
            type="button"
            className={`rte-toolbar-btn ${isActive ? 'active' : ''}`}
            onClick={onClick}
            disabled={disabled}
            title={label}
            aria-label={label}
        >
            <Icon size={16} />
        </button>
    );
}

// ─── Slash Commands Dropdown ─────────────────────────────────────
function SlashMenu({ query, onSelect, position }) {
    const filtered = SlashCommands.filter(cmd =>
        cmd.command.includes(query.toLowerCase()) || cmd.title.toLowerCase().includes(query.toLowerCase())
    );
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    if (filtered.length === 0) return null;

    return (
        <div className="rte-slash-menu" style={{ top: position.top, left: position.left }}>
            <div className="rte-slash-menu-header">Commands</div>
            {filtered.map((cmd, index) => (
                <button
                    key={cmd.command}
                    className={`rte-slash-menu-item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={() => onSelect(cmd)}
                    onMouseEnter={() => setSelectedIndex(index)}
                >
                    <cmd.icon size={16} />
                    <span>{cmd.title}</span>
                    <span className="rte-slash-shortcut">/{cmd.command}</span>
                </button>
            ))}
        </div>
    );
}

// ─── Link Dialog ─────────────────────────────────────────────────
function LinkDialog({ onSubmit, onClose, initialUrl = '' }) {
    const [url, setUrl] = useState(initialUrl);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onSubmit(url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`);
        }
        onClose();
    };

    return (
        <div className="rte-link-dialog">
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Paste or type a link..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="rte-link-input"
                />
                <div className="rte-link-actions">
                    <button type="button" className="rte-link-btn cancel" onClick={onClose}>Cancel</button>
                    <button type="submit" className="rte-link-btn confirm">Apply</button>
                </div>
            </form>
        </div>
    );
}

// ─── Main Editor Component ───────────────────────────────────────
export const RichTextEditor = forwardRef(function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Type your message...',
    editable = true,
    minHeight = '120px',
    maxHeight = '400px',
    showToolbar = true,
    compact = false,
    className = '',
    onSubmit,
}, ref) {
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashQuery, setSlashQuery] = useState('');
    const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const slashStartPos = useRef(null);
    const editorContainerRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We use CodeBlockLowlight instead
                heading: { levels: [1, 2, 3, 4, 5, 6] },
            }),
            Placeholder.configure({ placeholder }),
            Underline,
            Highlight.configure({ multicolor: false }),
            Typography,
            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: {
                    class: 'rte-link',
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            TaskList,
            TaskItem.configure({ nested: true }),
            CodeBlockLowlight.configure({ lowlight }),
        ],
        content: value,
        editable,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            // If content is just an empty paragraph, treat as empty
            const isEmpty = html === '<p></p>' || html === '';
            onChange?.(isEmpty ? '' : html);

            // Slash command detection
            const { from } = editor.state.selection;
            const textBefore = editor.state.doc.textBetween(
                Math.max(0, from - 20), from, '\n'
            );

            const slashMatch = textBefore.match(/\/(\w*)$/);
            if (slashMatch) {
                if (!showSlashMenu) {
                    slashStartPos.current = from - slashMatch[0].length;

                    // Get cursor position for menu
                    const coords = editor.view.coordsAtPos(from);
                    const containerRect = editorContainerRef.current?.getBoundingClientRect();
                    if (containerRect) {
                        setSlashPosition({
                            top: coords.bottom - containerRect.top + 4,
                            left: coords.left - containerRect.left,
                        });
                    }
                }
                setSlashQuery(slashMatch[1]);
                setShowSlashMenu(true);
            } else {
                setShowSlashMenu(false);
                slashStartPos.current = null;
            }
        },
        editorProps: {
            handleKeyDown(view, event) {
                // Slash menu keyboard navigation
                if (showSlashMenu) {
                    if (event.key === 'Escape') {
                        setShowSlashMenu(false);
                        return true;
                    }
                }

                // Submit on Ctrl/Cmd + Enter
                if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                    onSubmit?.();
                    return true;
                }

                return false;
            },
            attributes: {
                class: 'rte-content',
                style: `min-height: ${minHeight}; max-height: ${maxHeight}`,
            },
        },
    });

    // Expose editor methods via ref
    useImperativeHandle(ref, () => ({
        getHTML: () => editor?.getHTML() || '',
        getJSON: () => editor?.getJSON() || null,
        getText: () => editor?.getText() || '',
        getMarkdown: () => {
            // Basic HTML to Markdown conversion
            const html = editor?.getHTML() || '';
            return html
                .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
                .replace(/<em>(.*?)<\/em>/g, '*$1*')
                .replace(/<u>(.*?)<\/u>/g, '__$1__')
                .replace(/<s>(.*?)<\/s>/g, '~~$1~~')
                .replace(/<code>(.*?)<\/code>/g, '`$1`')
                .replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (_, level, text) => '#'.repeat(level) + ' ' + text)
                .replace(/<blockquote><p>(.*?)<\/p><\/blockquote>/g, '> $1')
                .replace(/<li><p>(.*?)<\/p><\/li>/g, '- $1')
                .replace(/<hr>/g, '---')
                .replace(/<p>(.*?)<\/p>/g, '$1\n')
                .replace(/<br\s*\/?>/g, '\n')
                .replace(/<[^>]+>/g, '')
                .trim();
        },
        clear: () => editor?.commands.clearContent(),
        setContent: (content) => editor?.commands.setContent(content),
        focus: () => editor?.commands.focus(),
        isEmpty: () => {
            const html = editor?.getHTML() || '';
            return html === '<p></p>' || html === '';
        },
        editor,
    }), [editor]);

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== undefined) {
            const currentHTML = editor.getHTML();
            const isEmpty = currentHTML === '<p></p>' || currentHTML === '';
            const valueIsEmpty = value === '' || value === '<p></p>';

            if (valueIsEmpty && isEmpty) return;
            if (currentHTML !== value) {
                editor.commands.setContent(value || '', false);
            }
        }
    }, [value, editor]);

    // Handle slash command selection
    const handleSlashSelect = useCallback((cmd) => {
        if (!editor || slashStartPos.current === null) return;

        // Delete the slash command text
        const { from } = editor.state.selection;
        editor.chain().focus()
            .deleteRange({ from: slashStartPos.current, to: from })
            .run();

        // Execute the command
        cmd.action(editor);
        setShowSlashMenu(false);
        slashStartPos.current = null;
    }, [editor]);

    // Handle link insertion
    const handleLinkInsert = useCallback((url) => {
        if (!editor) return;
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    // Handle image upload
    const handleImageUpload = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                editor?.chain().focus().setImage({ src: e.target.result, alt: file.name }).run();
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }, [editor]);

    if (!editor) return null;

    return (
        <div
            ref={editorContainerRef}
            className={`rte-container ${compact ? 'rte-compact' : ''} ${className}`}
        >
            {/* Toolbar */}
            {showToolbar && (
                <div className="rte-toolbar">
                    <div className="rte-toolbar-group">
                        <ToolbarButton icon={Bold} label="Bold (Ctrl+B)" isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
                        <ToolbarButton icon={Italic} label="Italic (Ctrl+I)" isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
                        <ToolbarButton icon={UnderlineIcon} label="Underline (Ctrl+U)" isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
                        <ToolbarButton icon={Strikethrough} label="Strikethrough" isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} />
                        <ToolbarButton icon={Highlighter} label="Highlight" isActive={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} />
                    </div>

                    <div className="rte-toolbar-divider" />

                    <div className="rte-toolbar-group">
                        <ToolbarButton icon={Heading1} label="Heading 1" isActive={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
                        <ToolbarButton icon={Heading2} label="Heading 2" isActive={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
                        <ToolbarButton icon={Heading3} label="Heading 3" isActive={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
                    </div>

                    <div className="rte-toolbar-divider" />

                    <div className="rte-toolbar-group">
                        <ToolbarButton icon={List} label="Bullet List" isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
                        <ToolbarButton icon={ListOrdered} label="Numbered List" isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
                        <ToolbarButton icon={ListChecks} label="Task List" isActive={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()} />
                    </div>

                    <div className="rte-toolbar-divider" />

                    <div className="rte-toolbar-group">
                        <ToolbarButton icon={Quote} label="Blockquote" isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
                        <ToolbarButton icon={Code} label="Inline Code" isActive={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} />
                        <ToolbarButton icon={FileCode} label="Code Block" isActive={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
                        <ToolbarButton icon={Minus} label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
                    </div>

                    <div className="rte-toolbar-divider" />

                    <div className="rte-toolbar-group">
                        <ToolbarButton icon={LinkIcon} label="Link (Ctrl+K)" isActive={editor.isActive('link')} onClick={() => {
                            if (editor.isActive('link')) {
                                editor.chain().focus().unsetLink().run();
                            } else {
                                setShowLinkDialog(true);
                            }
                        }} />
                        <ToolbarButton icon={ImageIcon} label="Image" onClick={handleImageUpload} />
                    </div>

                    <div className="rte-toolbar-spacer" />

                    <div className="rte-toolbar-group">
                        <ToolbarButton icon={Undo} label="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
                        <ToolbarButton icon={Redo} label="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
                    </div>
                </div>
            )}

            {/* Bubble Menu (appears on text selection) */}
            {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }} className="rte-bubble-menu">
                    <ToolbarButton icon={Bold} label="Bold" isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
                    <ToolbarButton icon={Italic} label="Italic" isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
                    <ToolbarButton icon={UnderlineIcon} label="Underline" isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
                    <ToolbarButton icon={Strikethrough} label="Strikethrough" isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} />
                    <ToolbarButton icon={Code} label="Code" isActive={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} />
                    <ToolbarButton icon={LinkIcon} label="Link" isActive={editor.isActive('link')} onClick={() => {
                        if (editor.isActive('link')) {
                            editor.chain().focus().unsetLink().run();
                        } else {
                            setShowLinkDialog(true);
                        }
                    }} />
                </BubbleMenu>
            )}

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Slash Commands */}
            {showSlashMenu && (
                <SlashMenu
                    query={slashQuery}
                    onSelect={handleSlashSelect}
                    position={slashPosition}
                />
            )}

            {/* Link Dialog */}
            {showLinkDialog && (
                <LinkDialog
                    initialUrl={editor.isActive('link') ? editor.getAttributes('link').href : ''}
                    onSubmit={handleLinkInsert}
                    onClose={() => setShowLinkDialog(false)}
                />
            )}

            {/* Status Bar */}
            {!compact && (
                <div className="rte-status-bar">
                    <span className="rte-status-hint">
                        Type <kbd>/</kbd> for commands • <kbd>Ctrl+Enter</kbd> to submit
                    </span>
                    <span className="rte-char-count">
                        {editor.storage.characterCount?.characters?.() ?? editor.getText().length} chars
                    </span>
                </div>
            )}
        </div>
    );
});

export default RichTextEditor;
