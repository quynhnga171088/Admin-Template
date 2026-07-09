import { useMemo, useState } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal
} from '@floating-ui/react';
import { useDetectOutsideClick } from '@/components/useDetectOutsideClick';
import SimpleBarScroll from '@/components/SimpleBarScroll';
import '@/components/ui/dropdown/Dropdown.scss';
import type { IDropdownOption } from '@/types/types';

export const Dropdown = ({
  dataSelected,
  setDataSelected,
  itemData,
  id,
  name,
  onBlur,
  hasError,
  portal = false
}: {
  dataSelected: string | number | null;
  setDataSelected: (dataSelected: any) => void;
  itemData: IDropdownOption[];
  id?: string;
  name?: string;
  onBlur?: () => void;
  hasError?: boolean;
  portal?: boolean;
}) => {
  /* Legacy path (non-portal): keeps the exact original behaviour */
  const { ref, isOpen: legacyOpen, setIsOpen: setLegacyOpen } = useDetectOutsideClick<HTMLDivElement>(false);

  /* Portal path: floating-ui handles position, resize, scroll, flip & shift */
  const [floatingOpen, setFloatingOpen] = useState(false);
  const {
    refs: { setReference, setFloating },
    floatingStyles,
    context
  } = useFloating({
    open: floatingOpen,
    onOpenChange: setFloatingOpen,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          // Match the menu width to the trigger so it lines up like the inline version
          elements.floating.style.width = `${rects.reference.width}px`;
        }
      })
    ],
    whileElementsMounted: autoUpdate
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const isOpen = portal ? floatingOpen : legacyOpen;

  const closeDropdown = () => {
    if (portal) setFloatingOpen(false);
    else setLegacyOpen(false);
  };

  const getItemDataByValue = useMemo<IDropdownOption | undefined>(
    () => (dataSelected ? itemData.find(item => item.value === dataSelected) : undefined),
    [itemData, dataSelected]
  );

  const menu = (
    <div
      className="dropdown-menu dropdown-menu-end pc-h-dropdown overflow-hidden p-2"
      style={portal ? { position: 'static', width: '100%', margin: 0 } : undefined}
    >
      <div className="dropdown-body">
        <SimpleBarScroll className="profile-notification-scroll position-relative" style={{ maxHeight: 'calc(100vh - 225px)' }}>
          {itemData.map((each: IDropdownOption) => (
            <div
              className={`dropdown-item cursor-pointer ${each.className ?? ''} ${dataSelected === each.value ? 'active' : ''}`}
              onClick={() => {
                setDataSelected(each.value);
                closeDropdown();
              }} key={each.value}
            >
              {each && each.icon ? <i className={`fa-regular ${each.icon} me-2 align-middle`} /> : null}
              {each && each.imgUrl ? <img src={each.imgUrl} alt={each.label} style={{ height: '25px' }}/> : null}
              <span className="truncate">{each.label}</span>
            </div>
          ))}
        </SimpleBarScroll>
      </div>
    </div>
  );

  return (
    <div className={`dropdown-control-wrap dropdown ${isOpen ? 'drp-show' : ''}`} ref={ref}>
      {(id || name) && <input type="hidden" id={id} name={name} value={dataSelected ?? ''} readOnly />}
      <div
        ref={portal ? setReference : undefined}
        className={`form-control cursor-pointer dropdown-toggle arrow-none me-0 ${getItemDataByValue?.className ?? ''} ${hasError ? 'error' : ''}`}
        data-pc-toggle="dropdown"
        role="button"
        tabIndex={0}
        {...(portal ? getReferenceProps({ onBlur }) : { onClick: () => setLegacyOpen(!legacyOpen), onBlur })}
      >
        <div className="flex justify-between items-center">
          <span className="dropdown-selected-text-content flex items-center">
            {getItemDataByValue && getItemDataByValue.icon ? <i className={`fa-regular ${getItemDataByValue.icon} mr-2!`} /> : null}
            {getItemDataByValue && getItemDataByValue.imgUrl ? <img src={getItemDataByValue.imgUrl} alt={getItemDataByValue.label} style={{ height: '25px' }} /> : null}
            {getItemDataByValue ? <div className="truncate">{getItemDataByValue.label}</div> : 'Select Status'}
          </span>
          <span>
            <i className={`fa-regular ${isOpen ? 'fa-angle-up' : 'fa-angle-down'}`} />
          </span>
        </div>
      </div>

      {isOpen &&
        (portal ? (
          <FloatingPortal>
            {/* Re-wrap in .dropdown-control-wrap so the nested SCSS (colors, layout) still applies */}
            <div className="dropdown-control-wrap dropdown drp-show" ref={setFloating} style={{ ...floatingStyles, zIndex: 1100 }} {...getFloatingProps()}>
              {menu}
            </div>
          </FloatingPortal>
        ) : (
          menu
        ))}
    </div>
  );
};
