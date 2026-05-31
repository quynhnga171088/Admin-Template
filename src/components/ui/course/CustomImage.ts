import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageNodeView } from '@/components/ui/course/ImageNodeView';

/**
 * Extends the built-in Image extension with:
 *  - `width`  attribute  → stored as inline style
 *  - `align`  attribute  → controls wrapper flex-justify (left / center / right)
 *  - ReactNodeViewRenderer → renders ImageNodeView
 */
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: el => el.style.width || el.getAttribute('width') || null,
        renderHTML: attrs => (attrs.width ? { style: `width: ${attrs.width}` } : {})
      },
      align: {
        default: 'left',
        parseHTML: el => el.getAttribute('data-align') ?? 'left',
        renderHTML: attrs => ({ 'data-align': attrs.align ?? 'left' })
      }
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  }
});
