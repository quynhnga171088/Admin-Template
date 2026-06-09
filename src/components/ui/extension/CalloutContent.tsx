import { Fragment } from 'react';
import type { Editor } from '@tiptap/react';

import { ToolbarBtn } from '@/components/ui/extension/ToolbarBtn.tsx';
import '@/components/ui/extension/CalloutContent.scss';
import { CALLOUT_VARIANTS } from '@/config/constant.ts';

{/* Callout */}
export const CalloutContent = ({ editor }: { editor: Editor }) => (
  <Fragment>
    <ToolbarBtn
      title="Insert Callout"
      active={editor.isActive('callout')}
      onClick={() => editor.chain().focus().insertCallout().run()}
    >
      <i className="fa-solid fa-rectangle-pro" />
    </ToolbarBtn>

    {/* Variant switchers — only visible when cursor is inside a callout */}
    {editor.isActive('callout') && (
      <Fragment>
        {CALLOUT_VARIANTS.map(({ variant, color, title }) => (
          <button
            key={variant}
            type="button"
            title={`Convert to: ${title}`}
            className={`ml-1! rte-callout-variant-dot${
              editor.isActive('callout', { variant }) ? ' rte-callout-variant-dot--active' : ''
            }`}
            style={{ '--dot-color': color } as React.CSSProperties}
            onClick={() => editor.chain().focus().setCalloutVariant(variant).run()}
          />
        ))}
      </Fragment>
    )}
  </Fragment>);
