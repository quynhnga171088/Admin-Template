import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react';
import type { CalloutVariant } from '@/components/ui/course/CalloutExtension';

/**
 * Minimal React node view for callout blocks.
 * Renders a styled wrapper around fully-editable NodeViewContent.
 * Users type and format content (bold label, body text) themselves.
 */
export const CalloutNodeView = ({ node }: NodeViewProps) => {
  const variant = (node.attrs.variant as CalloutVariant) ?? 'info';

  return (
    <NodeViewWrapper
      className={`rte-callout rte-callout--${variant}`}
      data-callout={variant}
    >
      <NodeViewContent className="rte-callout-content" />
    </NodeViewWrapper>
  );
};
