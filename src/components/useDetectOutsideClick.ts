import { useState, useEffect, useRef } from 'react';

export const useDetectOutsideClick = <T extends HTMLElement = HTMLLIElement>(initialState: boolean) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      /* If the ref is attached and the click is outside the referenced element */
      if (
        ref.current &&
        target instanceof Node &&
        !ref.current.contains(target)
      ) {
        setIsOpen(false); // Close the component
      }
    };

    /* Add event listener only when the component is open */
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    /* Cleanup function to remove the listener */
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Re-run effect if the isOpen state changes

  return { ref, isOpen, setIsOpen };
};
