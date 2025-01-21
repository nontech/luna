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

  // Initialize editor
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const editor = window.CodeMirror(containerRef.current, {
      value: initialCode,
      mode: "python",
      theme: "monokai",
      lineNumbers: true,
      readOnly: readOnly,
      viewportMargin: Infinity,
    });

    editor.on("change", (instance: any) => {
      if (onChange) {
        onChange(instance.getValue());
      }
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current) {
        const element = editorRef.current.getWrapperElement();
        element.remove();
        editorRef.current = null;
      }
    };
  }, []); // Empty deps array since this should only run once on mount

  // Handle readOnly changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOption("readOnly", readOnly);
    }
  }, [readOnly]);

  // Handle initialCode changes from parent
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== initialCode) {
        const cursor = editorRef.current.getCursor();
        editorRef.current.setValue(initialCode);
        editorRef.current.setCursor(cursor);
      }
    }
  }, [initialCode]);

  return (
    <div
      ref={containerRef}
      className="border border-gray-300 rounded-lg overflow-hidden"
    />
  );
}
