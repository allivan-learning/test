import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import { ReactNode, useEffect } from 'react';

interface ModalProps {
  onCloseModal: () => void;
  children: ReactNode;
}

export default function Modal({ children, onCloseModal }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseModal]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCloseModal();
        }
      }}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body,
  );
}
