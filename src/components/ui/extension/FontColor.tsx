import { COLOR_PRESETS } from '@/config/constant.ts';
import type { Editor } from '@tiptap/react';

import '@/components/ui/extension/FontColor.scss';

export const FontColor = ({
  editor,
  showColorPicker,
  setShowColorPicker
}: {
  editor: Editor;
  showColorPicker: boolean;
  setShowColorPicker: (value: ((prev: boolean) => boolean) | boolean) => void;
}) => (
  <div className="rte-color-wrap">
    {!showColorPicker! ?
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
      : ''}

    {showColorPicker && (
      <div className="rte-color-palette" onMouseDown={e => e.preventDefault()}>
        <div className="rte-color-swatches">
          {COLOR_PRESETS.map((c: string, idx: number) => (
            <button
              key={c}
              type="button"
              className={`rte-color-swatch ${idx > 0 ? 'margin-left-2' : ''}`}
              style={{ background: c }}
              title={c}
              onClick={() => {
                editor.chain().focus().setColor(c).run();
                setShowColorPicker(false);
              }}
            />
          ))}
        </div>
        <div className="rte-color-custom">
          <span className="rte-color-select-label">Color selected:</span>
          <input
            className="ml-1! rte-color-input"
            type="color"
            value={editor.getAttributes('textStyle').color ?? '#212529'}
            onChange={e => editor.chain().focus().setColor(e.target.value).run()}
          />
          <button
            type="button"
            className="rte-color-reset"
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              setShowColorPicker(false);
            }}
          >
            <i className="fa-regular fa-ban" /> Remove Color
          </button>
        </div>
      </div>
    )}
  </div>
);
