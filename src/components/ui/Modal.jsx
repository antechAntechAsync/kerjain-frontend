import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Modal — glassmorphic overlay with spring enter/exit animation.
 *
 * Usage:
 *   <Modal open={isOpen} onClose={() => setOpen(false)} title="Edit Profile">
 *     <Modal.Body>...content...</Modal.Body>
 *     <Modal.Footer>...actions...</Modal.Footer>
 *   </Modal>
 */
export default function Modal({ open, onClose, title, description, size = 'md', children }) {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-screen-xl',
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-primary/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                'w-full rounded-sq-xl overflow-hidden',
                'bg-surface-container-lowest dark:bg-dark-surface-container-high',
                'shadow-[0_40px_80px_rgba(0,0,0,0.2)]',
                sizeClasses[size],
              )}
            >
              {/* Header */}
              {(title || onClose) && (
                <div className="flex items-start justify-between gap-4 p-6 pb-4">
                  <div>
                    {title && (
                      <h2 className="font-heading text-xl font-bold text-primary dark:text-dark-primary tracking-tight">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="mt-1 text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                        {description}
                      </p>
                    )}
                  </div>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low dark:hover:bg-dark-surface-container transition-colors text-on-surface-variant"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

Modal.Body = function ModalBody({ children, className }) {
  return (
    <div className={cn('px-6 py-2', className)}>{children}</div>
  );
};

Modal.Footer = function ModalFooter({ children, className }) {
  return (
    <div className={cn('flex items-center justify-end gap-3 p-6 pt-4 border-t border-outline-variant dark:border-dark-outline-variant', className)}>
      {children}
    </div>
  );
};
