import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  children: React.ReactNode;
  open?: boolean;
  onCancel?: () => void;
  footer?: React.ReactNode | null;
  width?: number;
  centered?: boolean;
  className?: string;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  children,
  open,
  onCancel,
  footer,
  width = 600,
  centered = false,
  className,
  title = 'Dialog',
}) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent 
        className={cn(
          "duration-300 animate-in fade-in zoom-in",
          "shadow-lg border-none",
        
          className
        )}
       
      >
        <DialogTitle className="sr-only">
          {title}
        </DialogTitle>
        
        {children}
        
        
      </DialogContent>
    </Dialog>
  );
};

export default Modal;