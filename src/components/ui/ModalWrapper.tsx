import React from 'react';
import Modal from '@/components/ui/Modal.tsx';
import { modalStore } from '@/stores/modal.store.ts';

const ModalWrapper = () => {
  const open = modalStore(state => state.open);
  const title = modalStore(state => state.title);
  const setTitle = modalStore(state => state.setTitle);
  const message = modalStore(state => state.message);
  const setMessage = modalStore(state => state.setMessage);
  const setOpen = modalStore(state => state.setOpen);
  const callback = modalStore(state => state.callback);
  const enableCancelButton = modalStore(state => state.enableCancelButton);
  const enableOkButton = modalStore(state => state.enableOkButton);

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title={title}
      size="md"
      footer={
        <React.Fragment>
          {enableCancelButton && <button className="btn btn-light" onClick={() => setOpen(false)}>
            Cancel
          </button>}
          {enableOkButton && <button
            className="btn btn-primary"
            onClick={() => {
              setOpen(false);
              setMessage('');
              setTitle('');
              if (callback) {
                callback();
              }
            }}
          >
            Ok
          </button>}
        </React.Fragment>
      }
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ModalWrapper;
