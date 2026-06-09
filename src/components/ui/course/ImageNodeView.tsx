import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { useCallback, useRef, useState } from 'react';

type Align = 'left' | 'center' | 'right';

export const ImageNodeView = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const { src, alt, width, align } = node.attrs as {
    src: string;
    alt?: string;
    width?: string;
    align?: Align;
  };

  const imgRef = useRef<HTMLImageElement>(null);
  const [resizing, setResizing] = useState(false);
  const startX = useRef(0);
  const startW = useRef(0);

  // ── Resize via drag ──────────────────────────────────────────────────────────
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startX.current = e.clientX;
      startW.current = imgRef.current?.offsetWidth ?? 300;
      setResizing(true);

      const onMove = (mv: MouseEvent) => {
        const newW = Math.max(80, startW.current + (mv.clientX - startX.current));
        updateAttributes({ width: `${newW}px` });
      };
      const onUp = () => {
        setResizing(false);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [updateAttributes]
  );

  // ── Alignment helpers ────────────────────────────────────────────────────────
  const setAlign = (a: Align) => updateAttributes({ align: a });

  const currentAlign: Align = align ?? 'left';

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent:
      currentAlign === 'center' ? 'center' : currentAlign === 'right' ? 'flex-end' : 'flex-start',
    width: '100%',
    margin: '0.5rem 0',
    position: 'relative',
    userSelect: resizing ? 'none' : undefined
  };

  return (
    <NodeViewWrapper style={wrapperStyle} draggable data-drag-handle>
      <div className={`rte-img-wrapper${selected ? ' rte-img-wrapper--selected' : ''}`}>
        {/* ── Floating toolbar ── */}
        {selected && (
          <div className="rte-img-toolbar" contentEditable={false}>
            {/* Alignment */}
            <button
              type="button"
              title="Căn trái"
              className={`rte-img-tb-btn${currentAlign === 'left' ? ' active' : ''}`}
              onMouseDown={e => { e.preventDefault(); setAlign('left'); }}
            >
              <i className="fa-regular fa-align-left" />
            </button>
            <button
              type="button"
              title="Căn giữa"
              className={`rte-img-tb-btn${currentAlign === 'center' ? ' active' : ''}`}
              onMouseDown={e => { e.preventDefault(); setAlign('center'); }}
            >
              <i className="fa-regular fa-align-center" />
            </button>
            <button
              type="button"
              title="Căn phải"
              className={`rte-img-tb-btn${currentAlign === 'right' ? ' active' : ''}`}
              onMouseDown={e => { e.preventDefault(); setAlign('right'); }}
            >
              <i className="fa-regular fa-align-right" />
            </button>

            <span className="rte-img-tb-divider" />

            {/* Width input */}
            <label className="rte-img-width-label" title="Chiều rộng ảnh">
              <i className="fa-regular fa-arrows-left-right" />
              <input
                type="number"
                className="rte-img-width-input"
                min={80}
                max={2000}
                value={parseInt(width ?? '0') || ''}
                placeholder="px"
                onMouseDown={e => e.stopPropagation()}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 80) updateAttributes({ width: `${v}px` });
                }}
              />
              <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>px</span>
            </label>

            <button
              type="button"
              title="Khôi phục kích thước gốc"
              className="rte-img-tb-btn"
              onMouseDown={e => { e.preventDefault(); updateAttributes({ width: null }); }}
            >
              <i className="fa-regular fa-arrow-rotate-left" />
            </button>
          </div>
        )}

        {/* ── Image ── */}
        <img
          ref={imgRef}
          src={src}
          alt={alt ?? ''}
          className="rte-img"
          style={{ width: width ?? undefined }}
          draggable={false}
        />

        {/* ── Resize handle ── */}
        {selected && (
          <div
            className={`rte-img-resize-handle${resizing ? ' resizing' : ''}`}
            onMouseDown={onMouseDown}
            title="Kéo để thay đổi kích thước"
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};
