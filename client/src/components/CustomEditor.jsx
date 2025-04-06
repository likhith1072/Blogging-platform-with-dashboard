import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { ParagraphNode, TextNode } from "lexical";
import ToolbarPlugin from "./ToolbarPlugin";

// ✅ Fallback empty content as stringified JSON
const EMPTY_CONTENT =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

function CustomEditor({ initialContent,onChange }) {

  const editorConfig = {
    namespace: "MyEditor",
    theme: {
      paragraph: "mb-4",
      heading: {
        h1: "text-3xl font-bold mb-2",
        h2: "text-2xl font-semibold mb-2",
        h3: "text-xl font-medium mb-2",
      },
      quote: "italic border-l-4 pl-4 border-gray-300",
    },
    onError(error) {
      console.error("Editor Error:", error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      ParagraphNode,
      TextNode,
    ],
    // ✅ Set initial editorState to stringified JSON content
    editorState: initialContent || EMPTY_CONTENT, 
  };

  // ✅ Define the onChange function to log editor state
  // const onChange = (editorState) => {
  //   editorState.read(() => {
  //     const json = editorState.toJSON();
  //     console.log(JSON.stringify(json)); 
  //     console.log(editorState);// Logs JSON state to console
  //   });
  // };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
        <ToolbarPlugin />
        <div className="min-h-[300px] p-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-300">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input min-h-[300px] w-full outline-none bg-transparent" />
            }
            placeholder={
              <div className="text-gray-400">Start writing something...</div>
            }
            ErrorBoundary={({ error }) => {
              console.error("Error:", error);
              return <div className="text-red-500">Error loading editor!</div>;
            }}
          />
          <HistoryPlugin />
          {/* ✅ Attach the corrected onChange function */}
          <OnChangePlugin onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default CustomEditor;
