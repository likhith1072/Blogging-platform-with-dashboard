// src/components/ToolbarPlugin.jsx
import React from "react";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $getRoot,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  // ✅ Format Text Handler
  const formatText = (formatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };

  // ✅ Insert Heading Properly
  const insertHeading = (tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection?.isCollapsed()) {
        console.warn("Cannot insert heading with active selection.");
        return;
      }

      const root = $getRoot();
      const headingNode = $createHeadingNode(tag);
      root.append(headingNode);
      headingNode.select();
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-md shadow-sm">
      {/* ✅ Inline Formatting */}
      <button
        onClick={() => formatText("bold")}
        type="button"
        className="btn-toolbar font-bold "
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => formatText("italic")}
        type="button"
        className="btn-toolbar italic "
        title="Italic"
      >
        I
      </button>
      <button
        onClick={() => formatText("underline")}
        type="button"
        className="btn-toolbar underline "
        title="Underline"
      >
        U
      </button>
      <button
        onClick={() => formatText("strikethrough")}
        type="button"
        className="btn-toolbar line-through "
        title="Strikethrough"
      >
        S
      </button>

      {/* ✅ Headings */}
      <button
        onClick={() => insertHeading("h1")}
        type="button"
        className="btn-toolbar font-bold text-xl "
        title="H1"
      >
        H1
      </button>
      <button
        onClick={() => insertHeading("h2")}
        type="button"
        className="btn-toolbar font-bold text-lg "
        title="H2"
      >
        H2
      </button>
      <button
        onClick={() => insertHeading("h3")}
        type="button"
        className="btn-toolbar font-bold text-md "
        title="H3"
      >
        H3
      </button>

      {/* ✅ Text Alignment */}
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        type="button"
        className="btn-toolbar "
        title="Align Left"
      >
        ⬅️
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        type="button"
        className="btn-toolbar "
        title="Align Center"
      >
        ⏺️
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        type="button"
        className="btn-toolbar "
        title="Align Right"
      >
        ➡️
      </button>
    </div>
  );
} 