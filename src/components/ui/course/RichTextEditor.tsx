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
import { CalloutExtension, type CalloutVariant } from '@/components/ui/course/CalloutExtension';
import { FontSizeExtension, TextStyle } from '@/components/ui/course/FontSizeExtension';
import Color from '@tiptap/extension-color';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { type IModalState, modalStore } from '@/stores/modal.store.ts';
import '@/components/ui/course/RichTextEditor.scss';

const lowlight = createLowlight(common);

/* Toolbar Button */

const ToolbarBtn = ({
  onClick,
  active,
  disabled,
  title,
  children
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    className={`rte-btn${active ? ' rte-btn--active' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Divider = () => <span className="rte-divider" />;

/* Toolbar */

/* Callout variant config */
const CALLOUT_VARIANTS: { variant: CalloutVariant; color: string; title: string }[] = [
  { variant: 'info', color: 'var(--color-primary, #4680ff)', title: 'Info' },
  { variant: 'warning', color: 'var(--color-warning, #f4c22b)', title: 'Cảnh báo' },
  { variant: 'danger', color: 'var(--color-danger, #f44236)', title: 'Quan trọng' },
  { variant: 'success', color: 'var(--color-success, #1de9b6)', title: 'Ghi nhớ' }
];

/* Font size presets (px) */
const FONT_SIZES = ['10', '11', '12', '13', '14', '15', '16', '18', '20', '22', '24', '28', '32', '36', '48'];

/* Preset colors for the color palette */
const COLOR_PRESETS = [
  '#212529', '#495057', '#868e96', '#adb5bd', // grays
  '#4680ff', '#2d5fe0', '#0ca678', '#f4c22b', // brand
  '#f44236', '#e91e63', '#9c27b0', '#673ab7', // vivid
  '#2196f3', '#00bcd4', '#4caf50', '#ff9800' // material
];

const Toolbar = ({ editor }: { editor: Editor }) => {
  const setOpen = modalStore((state: IModalState) => state.setOpen);
  const setMessage = modalStore((state: IModalState) => state.setMessage);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  /* Current font size from selection */
  const currentFontSize = editor.getAttributes('textStyle').fontSize?.replace('px', '') ?? '';

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
    } catch (err) {
      setOpen(true);
      setMessage('Image upload failed, please try again leter!');
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
      <ToolbarBtn title="Heading 1" active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <span className="rte-btn-label">H1</span>
      </ToolbarBtn>
      <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <span className="rte-btn-label">H2</span>
      </ToolbarBtn>
      <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <span className="rte-btn-label">H3</span>
      </ToolbarBtn>

      <Divider />

      {/* Inline marks */}
      <ToolbarBtn title="Bold" active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}>
        <i className="fa-regular fa-bold" />
      </ToolbarBtn>
      <ToolbarBtn title="Italic" active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i className="fa-regular fa-italic" />
      </ToolbarBtn>
      <ToolbarBtn title="Underline" active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <i className="fa-regular fa-underline" />
      </ToolbarBtn>
      <ToolbarBtn title="Strikethrough" active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}>
        <i className="fa-regular fa-strikethrough" />
      </ToolbarBtn>
      <ToolbarBtn title="Highlight" active={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}>
        <i className="fa-regular fa-highlighter" />
      </ToolbarBtn>
      <ToolbarBtn title="Inline Code" active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}>
        <i className="fa-regular fa-code" />
      </ToolbarBtn>

      <Divider />

      {/* Font Size */}
      <select
        className="rte-select"
        title="Font size"
        value={currentFontSize}
        onChange={e => {
          const v = e.target.value;
          if (v) editor.chain().focus().setFontSize(`${v}px`).run();
          else editor.chain().focus().unsetFontSize().run();
        }}
      >
        <option value="">Size</option>
        {FONT_SIZES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Font Color */}
      <div className="rte-color-wrap">
        <button
          type="button"
          className="rte-color-btn"
          title="Font color"
          onClick={() => setShowColorPicker(v => !v)}
        >
          <i className="fa-solid fa-font" />
          <span
            className="rte-color-indicator"
            style={{ background: editor.getAttributes('textStyle').color ?? '#212529' }}
          />
        </button>

        {showColorPicker && (
          <div className="rte-color-palette" onMouseDown={e => e.preventDefault()}>
            <div className="rte-color-swatches">
              {COLOR_PRESETS.map(c => (
                <button
                  key={c}
                  type="button"
                  className="rte-color-swatch"
                  style={{ background: c }}
                  title={c}
                  onClick={() => {
                    editor.chain().focus().setColor(c).run();
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
            <label className="rte-color-custom">
              <span>Tùy chọn:</span>
              <input
                type="color"
                defaultValue={editor.getAttributes('textStyle').color ?? '#212529'}
                onChange={e => editor.chain().focus().setColor(e.target.value).run()}
              />
            </label>
            <button
              type="button"
              className="rte-color-reset"
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setShowColorPicker(false);
              }}
            >
              <i className="fa-regular fa-ban" /> Bỏ màu
            </button>
          </div>
        )}
      </div>

      <Divider />

      {/* Alignment */}
      <ToolbarBtn title="Align Left" active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <i className="fa-regular fa-align-left" />
      </ToolbarBtn>
      <ToolbarBtn title="Align Center" active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <i className="fa-regular fa-align-center" />
      </ToolbarBtn>
      <ToolbarBtn title="Align Right" active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <i className="fa-regular fa-align-right" />
      </ToolbarBtn>

      <Divider />

      {/* Lists */}
      <ToolbarBtn title="Bullet List" active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <i className="fa-regular fa-list-ul" />
      </ToolbarBtn>
      <ToolbarBtn title="Ordered List" active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <i className="fa-regular fa-list-ol" />
      </ToolbarBtn>

      <Divider />

      {/* Block elements */}
      <ToolbarBtn title="Blockquote" active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <i className="fa-regular fa-block-quote" />
      </ToolbarBtn>
      <ToolbarBtn title="Code Block" active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <i className="fa-regular fa-rectangle-code" />
      </ToolbarBtn>
      <ToolbarBtn title="Horizontal Rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <i className="fa-regular fa-horizontal-rule" />
      </ToolbarBtn>

      <Divider />

      {/* Link */}
      <ToolbarBtn title="Link" active={editor.isActive('link')} onClick={setLink}>
        <i className="fa-regular fa-link" />
      </ToolbarBtn>
      <ToolbarBtn title="Remove Link"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}>
        <i className="fa-regular fa-link-slash" />
      </ToolbarBtn>

      <Divider />

      {/* Image Upload */}
      <ToolbarBtn
        title={isUploading ? 'Đang tải ảnh...' : 'Insert Image'}
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
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
      <ToolbarBtn
        title="Insert Callout"
        active={editor.isActive('callout')}
        onClick={() => editor.chain().focus().insertCallout().run()}
      >
        <i className="fa-solid fa-rectangle-pro" />
      </ToolbarBtn>

      {/* Variant switchers — only visible when cursor is inside a callout */}
      {editor.isActive('callout') && (
        <>
          {CALLOUT_VARIANTS.map(({ variant, color, title }) => (
            <button
              key={variant}
              type="button"
              title={`Đổi sang: ${title}`}
              className={`rte-callout-variant-dot${
                editor.isActive('callout', { variant }) ? ' rte-callout-variant-dot--active' : ''
              }`}
              style={{ '--dot-color': color } as React.CSSProperties}
              onClick={() => editor.chain().focus().setCalloutVariant(variant).run()}
            />
          ))}
        </>
      )}

      <Divider />

      {/* Clear */}
      <ToolbarBtn title="Clear Formatting"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
        <i className="fa-regular fa-text-slash" />
      </ToolbarBtn>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Viết nội dung bài học tại đây...',
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
      CodeBlockLowlight.configure({ lowlight })
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
