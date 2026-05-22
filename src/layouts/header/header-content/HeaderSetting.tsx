import { useDetectOutsideClick } from 'src/components/useDetectOutsideClick';

const HeaderSetting = () => {
  const { ref, isOpen, setIsOpen } = useDetectOutsideClick(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className={`dropdown cursor-pointer pc-h-item ${isOpen ? 'drp-show' : ''}`} ref={ref}>
      <div className="pc-head-link dropdown-toggle me-0" role="button" onClick={toggleDropdown}>
        <i className="fa-regular fa-gem" />
      </div>
    </li>
  );
};

export default HeaderSetting;
