import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import { useRef, useState } from 'react';
import { resourceApi } from '@/lib/api/resource.api';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { CustomImage } from '@/components/ui/course/CustomImage';
import { CalloutExtension } from '@/components/ui/course/CalloutExtension';
import { FontSizeExtension, TextStyle } from '@/components/ui/course/FontSizeExtension';
import Color from '@tiptap/extension-color';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { type IModalState, modalStore } from '@/stores/modal.store';
import '@/components/ui/course/RichTextEditor.scss';

import { TableMenu } from '@/components/ui/extension/ExtensionTable';
import { ToolbarBtn } from '@/components/ui/extension/ToolbarBtn';
import { FontColor } from '@/components/ui/extension/FontColor';
import { FontSize } from '@/components/ui/extension/FontSize';
import { CalloutContent } from '@/components/ui/extension/CalloutContent';

const lowlight = createLowlight(common);

const Divider = () => <span className="rte-divider" />;

/* Toolbar */
const Toolbar = ({ editor }: { editor: Editor }) => {
  const setOpen = modalStore((state: IModalState) => state.setOpen);
  const setMessage = modalStore((state: IModalState) => state.setMessage);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL:', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      setIsUploading(true);
      const { data } = await resourceApi.uploadImg(file);
      editor.chain().focus().setImage({ src: data.fileUrl }).run();
    } catch {
      setOpen(true);
      setMessage('Image upload failed, please try again later!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rte-toolbar">
      {/* History */}
      <ToolbarBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <i className="fa-regular fa-rotate-left" />
      </ToolbarBtn>
      <ToolbarBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <i className="fa-regular fa-rotate-right" />
      </ToolbarBtn>
      <Divider />

      {/* Heading */}
      <ToolbarBtn title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <span className="rte-btn-label">H1</span>
      </ToolbarBtn>
      <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <span className="rte-btn-label">H2</span>
      </ToolbarBtn>
      <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <span className="rte-btn-label">H3</span>
      </ToolbarBtn>
      <Divider />

      {/* Inline marks */}
      <ToolbarBtn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <i className="fa-regular fa-bold" />
      </ToolbarBtn>
      <ToolbarBtn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i className="fa-regular fa-italic" />
      </ToolbarBtn>
      <ToolbarBtn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <i className="fa-regular fa-underline" />
      </ToolbarBtn>
      <ToolbarBtn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <i className="fa-regular fa-strikethrough" />
      </ToolbarBtn>
      <ToolbarBtn title="Highlight" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}>
        <i className="fa-regular fa-highlighter" />
      </ToolbarBtn>
      <ToolbarBtn title="Inline Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
        <i className="fa-regular fa-code" />
      </ToolbarBtn>
      <Divider />

      {/* Font Size */}
      <FontSize editor={editor} />
      <Divider />

      {/* Font Color */}
      <FontColor editor={editor} showColorPicker={showColorPicker} setShowColorPicker={setShowColorPicker} />
      <Divider />

      {/* Alignment */}
      <ToolbarBtn title="Align Left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <i className="fa-regular fa-align-left" />
      </ToolbarBtn>
      <ToolbarBtn title="Align Center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <i className="fa-regular fa-align-center" />
      </ToolbarBtn>
      <ToolbarBtn title="Align Right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <i className="fa-regular fa-align-right" />
      </ToolbarBtn>
      <Divider />

      {/* Lists */}
      <ToolbarBtn title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <i className="fa-regular fa-list-ul" />
      </ToolbarBtn>
      <ToolbarBtn title="Ordered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <i className="fa-regular fa-list-ol" />
      </ToolbarBtn>
      <Divider />

      {/* Block elements */}
      <ToolbarBtn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <i className="fa-regular fa-block-quote" />
      </ToolbarBtn>
      <ToolbarBtn title="Code Block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <i className="fa-regular fa-rectangle-code" />
      </ToolbarBtn>
      <ToolbarBtn title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <i className="fa-regular fa-horizontal-rule" />
      </ToolbarBtn>
      <Divider />

      {/* Link */}
      <ToolbarBtn title="Link" active={editor.isActive('link')} onClick={setLink}>
        <i className="fa-regular fa-link" />
      </ToolbarBtn>
      <ToolbarBtn title="Remove Link" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')}>
        <i className="fa-regular fa-link-slash" />
      </ToolbarBtn>
      <Divider />

      {/* Image Upload */}
      <ToolbarBtn title={isUploading ? 'Loading Image...' : 'Insert Image'} disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
        {isUploading
          ? <i className="fa-regular fa-spinner fa-spin" />
          : <i className="fa-regular fa-image" />}
      </ToolbarBtn>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <Divider />

      {/* Callout */}
      <CalloutContent editor={editor} />
      <Divider />

      {/* Table */}
      <TableMenu editor={editor} />
      <Divider />

      {/* Clear */}
      <ToolbarBtn title="Clear Formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
        <i className="fa-regular fa-text-slash" />
      </ToolbarBtn>
    </div>
  );
};

/* Main Component */

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  minHeight = 360
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false // replaced by CodeBlockLowlight
      }),
      Underline,
      Highlight,
      TextStyle,
      Color,
      FontSizeExtension,
      CustomImage.configure({ inline: false, allowBase64: true }),
      CalloutExtension,

      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  if (!editor) return null;

  return (
    <div className="rte-wrapper">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="rte-content"
        style={{ minHeight: `${minHeight}px` }}
      />
    </div>
  );
};

export default RichTextEditor;
