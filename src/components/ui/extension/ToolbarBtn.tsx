
/* Toolbar Button */
export const ToolbarBtn = ({
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
