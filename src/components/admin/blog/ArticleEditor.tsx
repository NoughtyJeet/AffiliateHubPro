'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { 
    Bold, Italic, List, ListOrdered, Quote, Undo, Redo, 
    Link as LinkIcon, Image as ImageIcon, Type, 
    AlignLeft, AlignCenter, AlignRight, Underline as UnderlineIcon,
    Table as TableIcon, Youtube as YoutubeIcon, CheckSquare
} from 'lucide-react';

interface ArticleEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuButton = ({ onClick, isActive = false, children, title }: any) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-2 rounded-lg transition-all ${
            isActive 
            ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/10' 
            : 'text-slate-500 hover:bg-slate-100'
        }`}
    >
        {children}
    </button>
);

export default function ArticleEditor({ content, onChange }: ArticleEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            Image,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({ placeholder: 'Start writing your masterpiece...' }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Youtube.configure({ width: 480, height: 320 }),
            TaskList,
            TaskItem.configure({ nested: true }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('Enter Image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const addYoutube = () => {
        const url = window.prompt('Enter YouTube URL');
        if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
    };

    return (
        <div className="border border-gray-100 rounded-[2.5rem] overflow-hidden bg-white shadow-sm flex flex-col min-h-[500px]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-4 border-b border-gray-50 bg-gray-50/50 sticky top-0 z-10">
                <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                    <Bold size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                    <Italic size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                    <UnderlineIcon size={18} />
                </MenuButton>
                
                <div className="w-px h-6 bg-gray-200 mx-2" />
                
                <MenuButton onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} title="Paragraph">
                    <Type size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="H2">
                    <span className="font-bold text-sm">H2</span>
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="H3">
                    <span className="font-bold text-sm">H3</span>
                </MenuButton>
                
                <div className="w-px h-6 bg-gray-200 mx-2" />
                
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
                    <AlignLeft size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
                    <AlignCenter size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
                    <AlignRight size={18} />
                </MenuButton>
                
                <div className="w-px h-6 bg-gray-200 mx-2" />
                
                <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
                    <List size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
                    <ListOrdered size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task List">
                    <CheckSquare size={18} />
                </MenuButton>
                
                <div className="w-px h-6 bg-gray-200 mx-2" />
                
                <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
                    <Quote size={18} />
                </MenuButton>
                <MenuButton onClick={addImage} title="Insert Image">
                    <ImageIcon size={18} />
                </MenuButton>
                <MenuButton onClick={addYoutube} title="Insert Video">
                    <YoutubeIcon size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
                    <TableIcon size={18} />
                </MenuButton>
                
                <div className="flex-1" />
                
                <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                    <Undo size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                    <Redo size={18} />
                </MenuButton>
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-8 prose prose-orange max-w-none focus:outline-none overflow-y-auto">
                <EditorContent editor={editor} className="min-h-full" />
            </div>

            {/* Status Footer */}
            <div className="px-6 py-2 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="flex gap-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Characters: {editor.storage.characterCount?.characters?.() || 0}
                    </p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Words: {editor.storage.characterCount?.words?.() || 0}
                    </p>
                </div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    TipTap Pro v2.11
                </p>
            </div>

            <style jsx global>{`
                .ProseMirror {
                    outline: none !important;
                    min-h-[400px];
                    color: #111827; /* text-gray-900 */
                    font-weight: 500; /* font-medium */
                    line-height: 1.7;
                    font-size: 1.05rem;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9ca3af; /* text-gray-400 */
                    font-weight: 400;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4 {
                    color: #030712; /* text-gray-950 */
                    font-weight: 900 !important;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                }
                .ProseMirror a {
                    color: #475569; /* text-slate-600 */
                    text-decoration: underline;
                    font-weight: 600;
                }
                .ProseMirror blockquote {
                    border-left: 4px solid #475569; /* slate-600 border */
                    background-color: #f8fafc; /* slate-50 background */
                    padding: 1rem 1.5rem;
                    margin: 1.5rem 0;
                    border-radius: 0 0.5rem 0.5rem 0;
                    color: #334155; /* text-slate-700 */
                    font-style: italic;
                    font-weight: 600;
                }
                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 2rem 0;
                    overflow: hidden;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
                }
                .ProseMirror td, .ProseMirror th {
                    min-width: 1em;
                    border: 1px solid #d1d5db; /* border-gray-300 */
                    padding: 0.75rem;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                }
                .ProseMirror th {
                    font-weight: 800;
                    text-align: left;
                    background-color: #f3f4f6; /* bg-gray-100 */
                    color: #111827;
                }
                .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 1rem;
                    margin: 2rem 0;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                }
                .ProseMirror iframe {
                    border-radius: 1rem;
                    border: none;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                }
                .ProseMirror ul[data-type="taskList"] {
                    list-style: none;
                    padding: 0;
                }
                .ProseMirror ul[data-type="taskList"] li {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
                    cursor: pointer;
                    width: 1.2rem;
                    height: 1.2rem;
                    accent-color: #1e293b;
                }
            `}</style>
        </div>
    );
}
