"use client";

import { useEffect, useRef } from "react";

interface CodeMirrorEditor {
  setValue: (value: string) => void;
  getValue: () => string;
  setOption: (option: string, value: unknown) => void;
  getCursor: () => { line: number; ch: number };
  setCursor: (cursor: { line: number; ch: number }) => void;
  getWrapperElement: () => HTMLElement;
  on: (
    event: string,
    handler: (instance: CodeMirrorEditor) => void
  ) => void;
}

interface CodeEditorProps {
  initialCode: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

declare global {
  interface Window {
    CodeMirror: (
      element: HTMLElement,
      options: {
        value: string;
        mode: string;
        theme: string;
        lineNumbers: boolean;
        readOnly: boolean;
        viewportMargin: number;
      }
    ) => CodeMirrorEditor;
  }
}

export function CodeEditor({
  initialCode,
  onChange,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<CodeMirrorEditor | null>(null);
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

    const handleChange = (instance: CodeMirrorEditor) => {
      if (onChange) {
        onChange(instance.getValue());
      }
    };

    editor.on("change", handleChange);
    editorRef.current = editor;

    return () => {
      if (editorRef.current) {
        const element = editorRef.current.getWrapperElement();
        element.remove();
        editorRef.current = null;
      }
    };
  }, [onChange, readOnly]);

  // Handle readOnly changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOption("readOnly", readOnly);
    }
  }, [readOnly]);

  useEffect(() => {
    // Only update if editor exists and this is the first initialization
    if (editorRef.current && !editorRef.current.getValue()) {
      editorRef.current.setValue(initialCode);
    }
  }, [initialCode]);

  return (
    <div
      ref={containerRef}
      className="border border-gray-300 rounded-lg overflow-hidden"
    />
  );
}
