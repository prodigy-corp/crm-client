"use client";

import { useRef, useMemo, memo } from "react";
import dynamic from "next/dynamic";

// Dynamically import Jodit to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-md border">
      <p className="text-sm text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readonly?: boolean;
  height?: number;
  className?: string;
}

const RichTextEditor = memo(({
  value,
  onChange,
  placeholder = "Start writing your content...",
  readonly = false,
  height = 500,
  className = "",
}: RichTextEditorProps) => {
  const editor = useRef(null);

  // Jodit configuration
  const config = useMemo(
    () => ({
      readonly,
      placeholder,
      height,
      minHeight: 400,
      maxHeight: 800,
      
      // Toolbar configuration
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "video",
        "table",
        "link",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "symbol",
        "fullsize",
        "preview",
      ],
      
      // Button groups
      buttonsMD: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "|",
        "image",
        "link",
        "|",
        "align",
        "|",
        "undo",
        "redo",
      ],
      
      buttonsSM: [
        "bold",
        "italic",
        "|",
        "ul",
        "ol",
        "|",
        "fontsize",
        "|",
        "image",
        "link",
      ],
      
      buttonsXS: [
        "bold",
        "italic",
        "|",
        "ul",
        "ol",
        "|",
        "image",
      ],
      
      // Editor behavior
      toolbarAdaptive: true,
      toolbarSticky: true,
      toolbarStickyOffset: 100,
      
      // Image upload
      uploader: {
        insertImageAsBase64URI: true, // For demo purposes
        // In production, configure proper image upload endpoint
        // url: '/api/upload',
        // format: 'json',
        // prepareData: (formData) => formData,
        // isSuccess: (resp) => !resp.error,
        // getMessage: (resp) => resp.message,
        // process: (resp) => ({ files: resp.files || [], path: '', baseurl: '', error: resp.error, message: resp.message }),
      },
      
      // Paste behavior
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_clear_html" as const,
      
      // Link behavior
      link: {
        openInNewTabCheckbox: true,
        noFollowCheckbox: false,
        modeClassName: "input" as const,
      },
      
      // Image settings
      image: {
        openOnDblClick: true,
        editSrc: true,
        editTitle: true,
        editAlt: true,
        editLink: true,
        editSize: true,
        editBorderRadius: true,
        editMargins: true,
        editClass: true,
        editStyle: true,
        editId: true,
        editAlign: true,
        showPreview: true,
        selectImageAfterClose: true,
      },
      
      // Styling
      style: {
        font: "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        minHeight: `${height}px`,
      },
      
      // Spellcheck
      spellcheck: true,
      
      // Enter behavior
      enter: "p" as const,
      
      // Clean HTML
      cleanHTML: {
        removeEmptyElements: false,
        fillEmptyParagraph: false,
        replaceNBSP: true,
        replaceOldTags: {
          i: "em" as const,
          b: "strong" as const,
        },
      },
      
      // Events
      events: {
        afterInit: (instance: any) => {
          // Custom initialization if needed
        },
      },
      
      // Disable right-click menu
      disablePlugins: ["mobile"],
      
      // Language
      language: "en",
      
      // Theme
      theme: "default",
      
      // Enable iframe mode for better isolation
      iframe: false,
      
      // Tab behavior
      useTabForIndent: true,
      
      // Direction
      direction: "ltr" as const,
      
      // Beautify HTML
      beautifyHTML: true,
    }),
    [readonly, placeholder, height]
  );

  return (
    <div className={`jodit-editor-wrapper ${className}`}>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
        onChange={(newContent) => {}}
      />
      <style jsx global>{`
        .jodit-editor-wrapper .jodit-container {
          border-radius: 0.5rem;
          border-color: hsl(var(--border));
          background: hsl(var(--background));
        }
        
        .jodit-editor-wrapper .jodit-toolbar-button {
          border-radius: 0.375rem;
        }
        
        .jodit-editor-wrapper .jodit-workplace {
          border-radius: 0 0 0.5rem 0.5rem;
          background: hsl(var(--background));
        }
        
        .jodit-editor-wrapper .jodit-wysiwyg {
          padding: 1rem;
          font-size: 15px;
          line-height: 1.7;
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          min-height: 400px;
        }
        
        .jodit-editor-wrapper .jodit-toolbar {
          background: hsl(var(--muted) / 0.3);
          border-bottom: 1px solid hsl(var(--border));
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .jodit-editor-wrapper .jodit-status-bar {
          background: hsl(var(--muted) / 0.3);
          border-top: 1px solid hsl(var(--border));
          color: hsl(var(--muted-foreground));
        }

        .jodit-editor-wrapper .jodit-toolbar-button__button {
          color: hsl(var(--foreground));
        }

        .jodit-editor-wrapper .jodit-toolbar-button__button:hover {
          background: hsl(var(--accent));
        }

        .jodit-editor-wrapper .jodit-ui-group {
          background: transparent;
        }
        
        /* Placeholder color */
        .jodit-editor-wrapper .jodit-wysiwyg::before {
          color: hsl(var(--muted-foreground)) !important;
        }

        /* Dropdown menus */
        .jodit-editor-wrapper .jodit-popup__content {
          background: hsl(var(--popover)) !important;
          border-color: hsl(var(--border)) !important;
          color: hsl(var(--popover-foreground)) !important;
        }

        .jodit-editor-wrapper .jodit-popup__content .jodit-toolbar-button__button {
          color: hsl(var(--popover-foreground));
        }
        
        /* Dark mode support */
        .dark .jodit-editor-wrapper .jodit-container {
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          border-color: hsl(var(--border));
        }
        
        .dark .jodit-editor-wrapper .jodit-toolbar {
          background: hsl(var(--muted) / 0.5);
          border-color: hsl(var(--border));
        }

        .dark .jodit-editor-wrapper .jodit-toolbar-button__button {
          color: hsl(var(--foreground));
        }
        
        .dark .jodit-editor-wrapper .jodit-wysiwyg {
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
        }

        .dark .jodit-editor-wrapper .jodit-workplace {
          background: hsl(var(--background));
        }

        .dark .jodit-editor-wrapper .jodit-status-bar {
          background: hsl(var(--muted) / 0.5);
          color: hsl(var(--muted-foreground));
          border-color: hsl(var(--border));
        }

        .dark .jodit-editor-wrapper .jodit-popup__content {
          background: hsl(var(--popover)) !important;
          border-color: hsl(var(--border)) !important;
        }
      `}</style>
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
