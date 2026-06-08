import { useMemo } from 'react';
import { useDetectOutsideClick } from '@/components/useDetectOutsideClick';
import SimpleBarScroll from '@/components/SimpleBarScroll';
import '@/components/ui/dropdown/Dropdown.scss';
import type { IDropdownOption } from '@/types/types.ts';

export const Dropdown = ({
  dataSelected,
  setDataSelected,
  itemData
}: {
  dataSelected: string | null;
  setDataSelected: (dataSelected: any) => void;
  itemData: IDropdownOption[]
}) => {
  const { ref, isOpen, setIsOpen } = useDetectOutsideClick<HTMLDivElement>(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getItemDataByValue = useMemo<IDropdownOption | undefined>(
    () => (dataSelected ? itemData.find(item => item.value === dataSelected) : undefined),
    [itemData, dataSelected]
  );

  return (
    <div className={`dropdown-control-wrap dropdown ${isOpen ? 'drp-show' : ''}`} ref={ref}>
      <div
        className={`form-control cursor-pointer dropdown-toggle arrow-none me-0 ${getItemDataByValue?.className || ''}`}
        data-pc-toggle="dropdown" role="button"
        onClick={toggleDropdown}
      >
        <div className="flex justify-between items-center">
          <span className="dropdown-selected-text-content">
            {getItemDataByValue && getItemDataByValue.icon ? <i className={`fa-regular ${getItemDataByValue.icon} mr-2!`} /> : null}
            {getItemDataByValue ? getItemDataByValue.label : 'Select Status'}
          </span>
          <span>
            <i className={`fa-regular ${isOpen ? 'fa-angle-up' : 'fa-angle-down'}`} />
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-menu dropdown-menu-end pc-h-dropdown overflow-hidden p-2">
          <div className="dropdown-body">
            <SimpleBarScroll className="profile-notification-scroll position-relative" style={{ maxHeight: 'calc(100vh - 225px)' }}>
              {itemData.map((each: IDropdownOption) => (
                <div
                  className={`dropdown-item cursor-pointer ${each.className ?? ''} ${dataSelected === each.value ? 'active' : ''}`}
                  onClick={() => {
                    setDataSelected(each.value);
                    toggleDropdown();
                  }} key={each.value}
                >
                  {each && each.icon ? <i className={`fa-regular ${each.icon} me-2 align-middle`} /> : null}
                  <span>{each.label}</span>
                </div>
              ))}
            </SimpleBarScroll>
          </div>
        </div>
      )}
    </div>
  );
};
