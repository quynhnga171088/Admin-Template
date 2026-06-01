import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CalloutNodeView } from '@/components/ui/course/CalloutNodeView';

export type CalloutVariant = 'info' | 'warning' | 'danger' | 'success';

// ── Augment Tiptap command types ──────────────────────────────────────────────
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      /** Insert a new callout block (default variant: info) */
      insertCallout: (variant?: CalloutVariant) => ReturnType;
      /** Change the variant of the currently focused callout */
      setCalloutVariant: (variant: CalloutVariant) => ReturnType;
    };
  }
}

// ── Extension ─────────────────────────────────────────────────────────────────
export const CalloutExtension = Node.create({
  name: 'callout',

  group: 'block',

  /** Allow any block content inside (paragraphs, headings, lists, etc.) */
  content: 'block+',

  /** Treat as a defining node so copy-paste keeps the wrapper */
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: 'info' as CalloutVariant,
        parseHTML: el => (el.getAttribute('data-callout') as CalloutVariant) ?? 'info',
        renderHTML: attrs => ({ 'data-callout': attrs.variant as string })
      }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView);
  },

  addCommands() {
    return {
      insertCallout:
        (variant: CalloutVariant = 'info') =>
          ({ commands }) =>
            commands.insertContent({
              type: this.name,
              attrs: { variant },
              content: [{ type: 'paragraph' }]
            }),

      setCalloutVariant:
        (variant: CalloutVariant) =>
          ({ commands }) =>
            commands.updateAttributes(this.name, { variant })
    };
  }
});
