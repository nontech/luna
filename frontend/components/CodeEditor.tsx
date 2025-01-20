"use client";

import { useEffect, useRef } from "react";

interface CodeEditorProps {
  initialCode: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

declare global {
  interface Window {
    CodeMirror: any;
  }
}

export function CodeEditor({
  initialCode,
  onChange,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create CodeMirror instance
    const editor = window.CodeMirror(containerRef.current, {
      value: initialCode, // Initial content
      mode: "python", // Syntax highlighting mode
      theme: "monokai", // Visual theme
      lineNumbers: true, // Show line numbers
      readOnly: readOnly, // Enable/disable editing
      viewportMargin: Infinity, // For proper height calculation
    });

    editor.on("change", (instance: any) => {
      if (onChange) {
        onChange(instance.getValue());
      }
    });

    editorRef.current = editor;

    // Cleanup function to remove the editor when the component unmounts
    return () => {
      if (editorRef.current) {
        const element = editorRef.current.getWrapperElement();
        element.remove();
      }
    };
  }, [initialCode, onChange, readOnly]);

  return (
    <div
      ref={containerRef}
      className="border border-gray-300 rounded-lg overflow-hidden"
    />
  );
}
