import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/* Types */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /* Modal visibility state */
  isOpen: boolean;
  /* Callback triggered when closing the modal (clicking overlay, pressing ESC, or clicking the close button) */
  onClose: () => void;
  /* Title shown in the modal header */
  title?: React.ReactNode;
  /* Main content of the modal */
  children: React.ReactNode;
  /* Footer content (usually contains action buttons) */
  footer?: React.ReactNode;
  /* Size of the modal. Default: 'md' */
  size?: ModalSize;
  /* Hide the close (X) button in the header */
  hideCloseButton?: boolean;
  /* Whether clicking the overlay (backdrop) closes the modal. Default: true */
  closeOnOverlayClick?: boolean;
  /* Whether pressing the ESC key closes the modal. Default: true */
  closeOnEsc?: boolean;
  /* Additional CSS class for the modal dialog */
  className?: string;
}

/* Modal Component */

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  hideCloseButton = false,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = ''
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  /* Close modal when pressing ESC */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  /* Prevent body scrolling when the modal is open */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  /* Focus on the dialog when opened for accessibility */
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={`modal-dialog modal-${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="modal-header">
            {title && (
              <h4 className="modal-title" id="modal-title">
                {title}
              </h4>
            )}
            {!hideCloseButton && (
              <button
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close"
                type="button"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer">
            <div className="modal-footer-actions">{footer}</div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
