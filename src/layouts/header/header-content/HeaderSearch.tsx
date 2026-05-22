import { useEffect, useRef } from 'react';

import { useDetectOutsideClick } from 'src/components/useDetectOutsideClick';
import 'src/layouts/header/header-content/HeaderSearch.scss';
import { userStore } from '@/stores/user.store';
import { type IUserState } from '@/types/types';

const HeaderSearch = () => {

  const search = userStore((state: IUserState) => state.search);

  const setSearch = userStore((state: IUserState) => state.setSearch);

  const setAction = userStore((state: IUserState) => state.setAction);

  const { ref, isOpen, setIsOpen } = useDetectOutsideClick(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className={`pc-h-item relative cursor-pointer ${isOpen ? 'drp-show' : ''}`} ref={ref}>
      <div className="pc-head-link dropdown-toggle me-0" data-pc-toggle="dropdown" onClick={toggleDropdown} role="button">
        <i className="fa-regular fa-magnifying-glass" />
      </div>
      {isOpen && (
        <div className="header-search absolute">
          <form className="px-2 py-1 !no-border">
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setAction(true);
                }
              }}
              type="search"
              className="form-control !no-border"
              placeholder="Please enter your keyword..."
            />
          </form>
        </div>
      )}
    </li>
  );
};

export default HeaderSearch;
export { HeaderSearch as Component };
