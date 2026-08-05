"use client";

import * as React from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  maxSizeMb?: number;
  helperText?: string;
  onFileSelect: (file: File | null) => void;
  invalid?: boolean;
  errorMessage?: string;
}

/**
 * Drag-and-drop file upload with a real, keyboard-accessible <input
 * type="file"> underneath — the dropzone is a visual enhancement, not
 * the only way to select a file, per Design System §11 (Accessibility).
 * Used for Careers résumé upload and the Admin Media Library uploader.
 */
export function FileUpload({
  id,
  label,
  accept,
  maxSizeMb = 10,
  helperText,
  onFileSelect,
  invalid,
  errorMessage,
}: FileUploadProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFile(selected: File | null) {
    if (selected && selected.size > maxSizeMb * 1024 * 1024) {
      return; // Consuming form should surface a size-limit error via `invalid`/`errorMessage`.
    }
    setFile(selected);
    onFileSelect(selected);
  }

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-label font-body text-neutral-900">
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-input border-2 border-dashed p-6 text-center transition-colors duration-fast",
          isDragging ? "border-secondary bg-secondary/5" : "border-border bg-surface",
          invalid && "border-error"
        )}
      >
        {!file ? (
          <>
            <UploadCloud className="size-[24px] text-neutral-600" aria-hidden="true" />
            <p className="text-body text-neutral-600">
              Drag a file here, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-secondary underline underline-offset-2"
              >
                browse
              </button>
            </p>
            {helperText && <p className="text-caption text-neutral-600">{helperText}</p>}
          </>
        ) : (
          <div className="flex w-full items-center justify-between gap-3 rounded-input bg-background px-4 py-2">
            <span className="flex items-center gap-2 truncate text-body text-neutral-900">
              <FileText className="size-[16px] shrink-0 text-secondary" aria-hidden="true" />
              <span className="truncate">{file.name}</span>
            </span>
            <button
              type="button"
              onClick={() => handleFile(null)}
              aria-label={`Remove ${file.name}`}
              className="shrink-0 text-neutral-600 hover:text-error"
            >
              <X className="size-[16px]" />
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="sr-only"
          aria-describedby={helperText ? `${id}-helper` : undefined}
        />
      </div>

      {invalid && errorMessage && (
        <p className="text-caption text-error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
