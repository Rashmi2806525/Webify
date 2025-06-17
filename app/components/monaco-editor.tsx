"use client"

import { useEffect, useRef } from "react"
import * as monaco from "monaco-editor"

interface MonacoEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
}

export default function MonacoEditor({ language, value, onChange }: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (editorRef.current && !monacoRef.current) {
      // Configure Monaco Editor
      monaco.editor.defineTheme("custom-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#1f2937",
          "editor.foreground": "#f9fafb",
        },
      })

      monaco.editor.defineTheme("custom-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#374151",
        },
      })

      // Create editor instance
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: "custom-light",
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: "line",
        wordWrap: "on",
        tabSize: 2,
        insertSpaces: true,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        glyphMargin: false,
        contextmenu: true,
        mouseWheelZoom: true,
        smoothScrolling: true,
        cursorBlinking: "blink",
        cursorSmoothCaretAnimation: "on",
        renderLineHighlight: "line",
        selectOnLineNumbers: true,
        matchBrackets: "always",
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        autoSurround: "languageDefined",
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "on",
        acceptSuggestionOnCommitCharacter: true,
        snippetSuggestions: "top",
        emptySelectionClipboard: false,
        copyWithSyntaxHighlighting: true,
        multiCursorModifier: "alt",
        accessibilitySupport: "auto",
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
      })

      // Listen for content changes
      monacoRef.current.onDidChangeModelContent(() => {
        if (monacoRef.current) {
          onChange(monacoRef.current.getValue())
        }
      })

      // Add keyboard shortcuts
      monacoRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        // Prevent default save behavior
        console.log("Save shortcut pressed")
      })
    }

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose()
        monacoRef.current = null
      }
    }
  }, [])

  // Update editor value when prop changes
  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== value) {
      monacoRef.current.setValue(value)
    }
  }, [value])

  // Update editor language when prop changes
  useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language)
      }
    }
  }, [language])

  // Handle theme changes based on system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const updateTheme = () => {
      if (monacoRef.current) {
        monacoRef.current.updateOptions({
          theme: mediaQuery.matches ? "custom-dark" : "custom-light",
        })
      }
    }

    updateTheme()
    mediaQuery.addEventListener("change", updateTheme)

    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return <div ref={editorRef} className="h-full w-full" />
}
