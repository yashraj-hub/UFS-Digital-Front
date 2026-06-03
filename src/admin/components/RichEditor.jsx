import { useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Youtube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import ResizeImage from "tiptap-extension-resize-image";
import "./RichEditor.css";

function ToolbarBtn({ onClick, active, title, children, disabled }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`re-btn${active ? " is-active" : ""}${disabled ? " is-disabled" : ""}`}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="re-divider" />;
}

export default function RichEditor({ value, onChange, readOnly = false }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
      ResizeImage.configure({ allowBase64: true }),
      Youtube.configure({ width: "100%", height: 480, nocookie: true }),
      Placeholder.configure({ placeholder: "Blog content likhein… (Hindi aur English dono supported hain)" }),
    ],
    content: value || "",
    editable: !readOnly,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const externalValueRef = useRef(value);

  // sync external value changes (e.g. when editing existing blog)
  useEffect(() => {
    if (!editor) return;

    if (externalValueRef.current === value) {
      return;
    }

    externalValueRef.current = value;

    if (editor.isFocused) {
      return;
    }

    if (editor.getHTML() !== (value || "")) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL:", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter YouTube URL:");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  if (!editor) return null;

  return (
    <div className={`rich-editor${readOnly ? " rich-editor--readonly" : ""}`}>
      {!readOnly && (
        <div className="re-toolbar">
          {/* Heading */}
          <select
            className="re-select"
            title="Heading"
            value={
              editor.isActive("heading", { level: 1 }) ? "h1"
              : editor.isActive("heading", { level: 2 }) ? "h2"
              : editor.isActive("heading", { level: 3 }) ? "h3"
              : "p"
            }
            onChange={(e) => {
              const v = e.target.value;
              if (v === "p") editor.chain().focus().setParagraph().run();
              else editor.chain().focus().setHeading({ level: Number(v.replace("h", "")) }).run();
            }}
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <Divider />

          {/* Basic formatting */}
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><b>B</b></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><i>I</i></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><u>U</u></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><s>S</s></ToolbarBtn>

          <Divider />

          {/* Text color */}
          <span className="re-color-wrap" title="Text color">
            <span className="re-color-label">A</span>
            <input
              type="color"
              className="re-color-input"
              title="Text color"
              onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
            />
          </span>

          {/* Highlight */}
          <span className="re-color-wrap" title="Highlight">
            <span className="re-color-label" style={{ background: "#fef08a", padding: "0 2px" }}>H</span>
            <input
              type="color"
              className="re-color-input"
              title="Highlight color"
              defaultValue="#fef08a"
              onInput={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
            />
          </span>

          <Divider />

          {/* Alignment */}
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">&#8676;</ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">&#8677;</ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">&#8677;</ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">&#8644;</ToolbarBtn>

          <Divider />

          {/* Lists */}
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">&#8226; List</ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">1. List</ToolbarBtn>

          <Divider />

          {/* Blocks */}
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">&ldquo;&rdquo;</ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">&lt;/&gt;</ToolbarBtn>

          <Divider />

          {/* Link */}
          <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Insert / edit link">🔗</ToolbarBtn>

          {/* Image */}
          <ToolbarBtn onClick={addImage} title="Insert image from URL">🖼</ToolbarBtn>

          {/* YouTube */}
          <ToolbarBtn onClick={addYoutube} title="Embed YouTube video">▶ YT</ToolbarBtn>

          <Divider />

          {/* Undo / Redo */}
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">↩</ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">↪</ToolbarBtn>

          <ToolbarBtn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">✕</ToolbarBtn>
        </div>
      )}

      <div className="re-content" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} className="tiptap" />
      </div>
    </div>
  );
}
