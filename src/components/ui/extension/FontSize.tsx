import type { Editor } from '@tiptap/react';

import { FONT_SIZES } from '@/config/constant.ts';
import '@/components/ui/extension/FontSize.scss';

export const FontSize = ({ editor }: { editor: Editor }) => {
  /* Current font size from selection */
  const currentFontSize = editor.getAttributes('textStyle').fontSize?.replace('rem', '').replace('px', '') ?? '';

  const handleOnchange = (value: string) => {
    if (value) editor.chain().focus().setFontSize(`${value}rem`).run();
    else editor.chain().focus().unsetFontSize().run();
  };

  return (
    <select className="rte-select" title="Font size" value={currentFontSize}
      onChange={e => handleOnchange(e.target.value)}
    >
      {FONT_SIZES.map((s: { label: string, value: string }) => (
        <option key={s.label} value={s.value}>{`${s.label} px`}</option>
      ))}
    </select>);
};
