import { useState, useRef } from 'react';
import type { Editor } from '@tiptap/react';

import { TABLE_SIZE } from '@/config/constant.ts';
import '@/components/ui/extension/ExtensionTable.scss';

/* Table menu dropdown */
export const TableMenu = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isInTable = editor.isActive('table');

  const action = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  return (
    <div className="rte-table-menu-wrap" ref={menuRef}>
      <button type="button" title="Table" className={`rte-btn${isInTable ? ' rte-btn--active' : ''}`} onClick={() => setOpen(v => !v)}>
        <i className="fa-regular fa-table" />
      </button>

      {open && (
        <div className="rte-table-dropdown" onMouseDown={e => e.preventDefault()}>
          {/* Insert */}
          {!isInTable && (
            <button type="button" className="rte-table-action"
              onClick={() => action(() =>
                editor.chain().focus().insertTable({ rows: TABLE_SIZE.rows, cols: TABLE_SIZE.columns, withHeaderRow: true }).run()
              )}>
              <i className="fa-regular fa-table" />{` Insert Table ${TABLE_SIZE.rows}x${TABLE_SIZE.columns}`}
            </button>
          )}

          {isInTable && (
            <>
              <div className="rte-table-group-label">Column</div>
              <button type="button" className="rte-table-action"
                onClick={() => action(() => editor.chain().focus().addColumnBefore().run())}>
                <i className="fa-regular fa-table-columns" /> Add Column Before
              </button>
              <button type="button" className="rte-table-action"
                onClick={() => action(() => editor.chain().focus().addColumnAfter().run())}>
                <i className="fa-regular fa-table-columns" /> Add Column After
              </button>
              <button type="button" className="rte-table-action rte-table-action--danger"
                onClick={() => action(() => editor.chain().focus().deleteColumn().run())}>
                <i className="fa-regular fa-trash" /> Delete Column
              </button>

              <div className="rte-table-group-label">Row</div>
              <button type="button" className="rte-table-action"
                onClick={() => action(() => editor.chain().focus().addRowBefore().run())}>
                <i className="fa-regular fa-table-rows" /> Add Row Before
              </button>
              <button type="button" className="rte-table-action"
                onClick={() => action(() => editor.chain().focus().addRowAfter().run())}>
                <i className="fa-regular fa-table-rows" /> Add Row After
              </button>
              <button type="button" className="rte-table-action rte-table-action--danger"
                onClick={() => action(() => editor.chain().focus().deleteRow().run())}>
                <i className="fa-regular fa-trash" /> Delete Row
              </button>

              <div className="rte-table-group-label">Cell</div>
              <button type="button" className="rte-table-action"
                onClick={() => action(() => editor.chain().focus().mergeCells().run())}>
                <i className="fa-regular fa-object-group" /> Merge Cells
              </button>
              <button type="button" className="rte-table-action"
                onClick={() => action(() => editor.chain().focus().splitCell().run())}>
                <i className="fa-regular fa-object-ungroup" /> Split Cell
              </button>
              <button type="button" className="rte-table-action"
                onClick={() => action(() => editor.chain().focus().toggleHeaderRow().run())}>
                <i className="fa-regular fa-heading" /> Toggle Header Row
              </button>

              <div className="rte-table-sep" />
              <button type="button" className="rte-table-action rte-table-action--danger"
                onClick={() => action(() => editor.chain().focus().deleteTable().run())}>
                <i className="fa-regular fa-table-xmark" /> Delete Table
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

