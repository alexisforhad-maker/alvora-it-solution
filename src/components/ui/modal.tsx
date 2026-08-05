"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ModalProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Modal — the higher-level component consuming code should reach for
 * (e.g. the consultation-booking calendar widget on the Contact page,
 * per Phase 2 UI/UX spec §14). Wraps the Dialog primitive so callers
 * don't need to assemble Dialog/DialogContent/DialogHeader by hand
 * for the common case.
 */
export function Modal({
  trigger,
  title,
  description,
  open,
  onOpenChange,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
