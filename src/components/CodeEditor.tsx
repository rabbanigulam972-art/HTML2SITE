import { forwardRef } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { EditorView } from "@codemirror/view";
import { dracula } from "@uiw/codemirror-theme-dracula";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor = forwardRef<ReactCodeMirrorRef, CodeEditorProps>(
  ({ value, onChange }, ref) => {
    return (
      <CodeMirror
        ref={ref}
        value={value}
        theme={dracula}
        height="100%"
        style={{ height: "100%", fontSize: 13 }}
        extensions={[
          html({ autoCloseTags: true, matchClosingTags: true }),
          EditorView.lineWrapping,
        ]}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          autocompletion: true,
          closeBrackets: true,
          bracketMatching: true,
          indentOnInput: true,
        }}
        onChange={(val) => onChange(val)}
      />
    );
  }
);

CodeEditor.displayName = "CodeEditor";
export default CodeEditor;
