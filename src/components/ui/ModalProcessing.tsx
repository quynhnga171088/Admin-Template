import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { modalStore } from '@/stores/modal.store.ts';

const ModalProcessing = () => {
  const isProcessing = modalStore(state => state.isProcessing);
  const processingMessage = modalStore(state => state.processingMessage);

  useEffect(() => {
    if (isProcessing) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isProcessing]);

  if (!isProcessing) return null;

  return createPortal(
    <div className="modal-processing-overlay" role="status" aria-live="polite" aria-label={processingMessage}>
      <div className="modal-processing-dialog">
        {/* Spinner */}
        <div className="modal-processing-spinner" aria-hidden="true">
          <span className="spinner-ring" />
          <span className="spinner-ring spinner-ring--delay" />
          <span className="spinner-ring spinner-ring--third" />
          <span className="spinner-glow" />
        </div>
        <p className="modal-processing-message">{processingMessage}</p>
      </div>
    </div>,
    document.body
  );
};

export default ModalProcessing;
