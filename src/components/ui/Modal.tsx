import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /** Trạng thái hiển thị / ẩn của modal */
  isOpen: boolean;
  /** Callback khi người dùng yêu cầu đóng (click overlay, nhấn ESC, hoặc click nút X) */
  onClose: () => void;
  /** Tiêu đề hiển thị trên header của modal */
  title?: React.ReactNode;
  /** Nội dung chính của modal */
  children: React.ReactNode;
  /** Nội dung phần footer (thường chứa các nút hành động) */
  footer?: React.ReactNode;
  /** Kích thước của modal. Mặc định: 'md' */
  size?: ModalSize;
  /** Ẩn nút X đóng trên header */
  hideCloseButton?: boolean;
  /** Click vào overlay (backdrop) có đóng modal không. Mặc định: true */
  closeOnOverlayClick?: boolean;
  /** Nhấn phím ESC có đóng modal không. Mặc định: true */
  closeOnEsc?: boolean;
  /** class CSS bổ sung cho modal-dialog */
  className?: string;
}

// ─── Modal Component ──────────────────────────────────────────────────────────
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

  // Đóng modal khi nhấn ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  // Khóa scroll của body khi modal mở
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

  // Focus vào dialog khi mở (accessibility)
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
                aria-label="Đóng"
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
