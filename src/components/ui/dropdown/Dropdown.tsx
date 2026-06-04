import { useDetectOutsideClick } from '@/components/useDetectOutsideClick';
import SimpleBarScroll from '@/components/SimpleBarScroll';
import '@/components/ui/dropdown/Dropdown.scss';
import type { IDropdownOption } from '@/types/types.ts';

export const Dropdown = ({
  dataSelected,
  setDataSelected,
  itemData
}: {
  dataSelected: IDropdownOption | null;
  setDataSelected: (dataSelected: any) => void;
  itemData: IDropdownOption[]
}) => {
  const { ref, isOpen, setIsOpen } = useDetectOutsideClick<HTMLDivElement>(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`dropdown-control-wrap dropdown ${isOpen ? 'drp-show' : ''}`} ref={ref}>
      <div className="form-control cursor-pointer dropdown-toggle arrow-none me-0" data-pc-toggle="dropdown" role="button" onClick={toggleDropdown}>
        <div className="flex justify-between items-center">
          <span className="dropdown-selected-text-content">
            {dataSelected && dataSelected.icon ? <i className={`fa-regular ${dataSelected.icon}`} /> : null}
            {dataSelected ? dataSelected.label : 'Select Status'}
          </span>
          <span>
            <i className={`fa-regular ${isOpen ? 'fa-angle-up' : 'fa-angle-down'}`} />
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown overflow-hidden p-2">
          <div className="dropdown-body">
            <SimpleBarScroll className="profile-notification-scroll position-relative" style={{ maxHeight: 'calc(100vh - 225px)' }}>
              {itemData.map((each: IDropdownOption) => (
                <div className="dropdown-item cursor-pointer" onClick={() => setDataSelected(each)} key={each.value}>
                  <span>
                    {each && each.icon ? <i className={`fa-regular ${each.icon} me-2 align-middle`} /> : null}
                    <span>{each.label}</span>
                  </span>
                </div>
              ))}
            </SimpleBarScroll>
          </div>
        </div>
      )}
    </div>
  );
};
