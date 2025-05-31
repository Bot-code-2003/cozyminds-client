"use client";

import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  PenTool,
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  ImageIcon,
  Code,
  Quote,
  Undo,
  Redo,
  Type,
  X,
} from "lucide-react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

// Custom Resizable Image Extension
const ResizableImageExtension = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return { height: attributes.height };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const container = document.createElement("div");
      container.className = "resizable-image-container";
      container.style.position = "relative";
      container.style.display = "inline-block";
      container.style.margin = "16px 0";

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.borderRadius = "8px";
      img.style.display = "block";

      if (node.attrs.width) {
        img.style.width = node.attrs.width + "px";
      }
      if (node.attrs.height) {
        img.style.height = node.attrs.height + "px";
      }

      // Resize handle
      const resizeHandle = document.createElement("div");
      resizeHandle.className = "resize-handle";
      resizeHandle.style.position = "absolute";
      resizeHandle.style.bottom = "0";
      resizeHandle.style.right = "0";
      resizeHandle.style.width = "20px";
      resizeHandle.style.height = "20px";
      resizeHandle.style.background = "var(--accent)";
      resizeHandle.style.cursor = "se-resize";
      resizeHandle.style.borderRadius = "0 0 8px 0";
      resizeHandle.style.opacity = "0";
      resizeHandle.style.transition = "opacity 0.2s";

      // Show handle on hover
      container.addEventListener("mouseenter", () => {
        resizeHandle.style.opacity = "0.8";
      });
      container.addEventListener("mouseleave", () => {
        resizeHandle.style.opacity = "0";
      });

      // Resize functionality
      let isResizing = false;
      let startX, startY, startWidth, startHeight;

      resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = Number.parseInt(
          document.defaultView.getComputedStyle(img).width,
          10
        );
        startHeight = Number.parseInt(
          document.defaultView.getComputedStyle(img).height,
          10
        );
        e.preventDefault();
      });

      document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        const width = startWidth + e.clientX - startX;
        const height = startHeight + e.clientY - startY;

        if (width > 50 && height > 50) {
          img.style.width = width + "px";
          img.style.height = height + "px";
        }
      });

      document.addEventListener("mouseup", () => {
        if (isResizing) {
          isResizing = false;
          const width = Number.parseInt(img.style.width, 10);
          const height = Number.parseInt(img.style.height, 10);

          // Update the node attributes
          if (typeof getPos === "function") {
            editor.commands.updateAttributes("image", {
              width: width,
              height: height,
            });
          }
        }
      });

      container.appendChild(img);
      container.appendChild(resizeHandle);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "image") return false;
          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || "";
          if (updatedNode.attrs.width) {
            img.style.width = updatedNode.attrs.width + "px";
          }
          if (updatedNode.attrs.height) {
            img.style.height = updatedNode.attrs.height + "px";
          }
          return true;
        },
      };
    };
  },
});

const JournalEditor = ({
  journalTitle,
  setJournalTitle,
  journalText,
  setJournalText,
  wordCount,
  onNext,
}) => {
  const titleRef = useRef(null);
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      UnderlineExtension,
      CharacterCount.configure({
        limit: null, // No character limit
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      LinkExtension.configure({
        openOnClick: false,
        linkOnPaste: true,
        autolink: true,
        protocols: ["http", "https"],
      }),
      ResizableImageExtension.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "resizable-image",
        },
      }),
      Placeholder.configure({
        placeholder:
          "Start writing your thoughts, experiences, or reflections...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: journalText || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setJournalText(html);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] max-w-none",
      },
    },
  });

  // Focus title on mount
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update editor content when journalText changes externally
  useEffect(() => {
    if (editor && journalText !== editor.getHTML()) {
      editor.commands.setContent(journalText || "");
    }
  }, [editor, journalText]);

  const setLink = () => {
    if (!editor) return;

    if (linkUrl.trim()) {
      // Add https if it doesn't exist
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }

    setIsLinkMenuOpen(false);
    setLinkUrl("");
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setIsLinkMenuOpen(false);
  };

  const addImage = () => {
    if (!editor || !imageUrl.trim()) return;

    // Basic URL validation
    try {
      new URL(imageUrl);
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setIsImageMenuOpen(false);
      setImageUrl("");
    } catch (error) {
      alert("Please enter a valid image URL");
    }
  };

  const ToolbarButton = ({ onClick, active, disabled, children, title }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent focus loss
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all duration-200 ${
        active
          ? "bg-[var(--accent)] text-white shadow-sm"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-6 mx-2 bg-[var(--border)] opacity-50" />
  );

  if (!editor) {
    return (
      <div className="mx-auto space-y-2 max-w-7xl">
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-[var(--bg-hover)] rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-[var(--bg-hover)] rounded mb-6"></div>
            <div className="h-4 bg-[var(--bg-hover)] rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-[var(--bg-hover)] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Get word and character counts
  const characterCount = editor.storage.characterCount || {};
  const words = characterCount.words ? characterCount.words() : 0;
  const characters = characterCount.characters
    ? characterCount.characters()
    : 0;

  return (
    <div className="mx-auto space-y-2">
      {/* Main Editor Card */}
      <div className="bg-[var(--bg-primary)] border border-[var(--border)]  rounded-2xl shadow-sm">
        {/* Content Section */}
        <div className="mb-6">
          {/* Rich Text Editor Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-1 p-3 mb-0 border border-[var(--border)] rounded-t-xl bg-[var(--bg-secondary)] border-b-0 ">
            {/* Text Formatting */}
            <div className="flex items-center flex-wrap">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive("bold")}
                title="Bold (Ctrl+B)"
              >
                <Bold size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive("italic")}
                title="Italic (Ctrl+I)"
              >
                <Italic size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive("underline")}
                title="Underline (Ctrl+U)"
              >
                <Underline size={18} />
              </ToolbarButton>

              <ToolbarDivider />

              {/* Headings */}
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                active={editor.isActive("heading", { level: 1 })}
                title="Heading 1"
              >
                <Heading1 size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                active={editor.isActive("heading", { level: 2 })}
                title="Heading 2"
              >
                <Heading2 size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                active={editor.isActive("heading", { level: 3 })}
                title="Heading 3"
              >
                <Heading3 size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().setParagraph().run()}
                active={editor.isActive("paragraph")}
                title="Paragraph"
              >
                <Type size={18} />
              </ToolbarButton>

              <ToolbarDivider />

              {/* Lists */}
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive("bulletList")}
                title="Bullet List"
              >
                <List size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive("orderedList")}
                title="Numbered List"
              >
                <ListOrdered size={18} />
              </ToolbarButton>

              <ToolbarDivider />

              {/* Alignment */}
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                active={editor.isActive({ textAlign: "left" })}
                title="Align Left"
              >
                <AlignLeft size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                active={editor.isActive({ textAlign: "center" })}
                title="Align Center"
              >
                <AlignCenter size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                active={editor.isActive({ textAlign: "right" })}
                title="Align Right"
              >
                <AlignRight size={18} />
              </ToolbarButton>

              <ToolbarDivider />

              {/* Special Formatting */}
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive("blockquote")}
                title="Quote"
              >
                <Quote size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                active={editor.isActive("codeBlock")}
                title="Code Block"
              >
                <Code size={18} />
              </ToolbarButton>

              <ToolbarDivider />

              {/* Media */}
              <ToolbarButton
                onClick={() => setIsLinkMenuOpen(!isLinkMenuOpen)}
                active={editor.isActive("link") || isLinkMenuOpen}
                title="Add Link"
              >
                <LinkIcon size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => setIsImageMenuOpen(!isImageMenuOpen)}
                active={isImageMenuOpen}
                title="Add Resizable Image"
              >
                <ImageIcon size={18} />
              </ToolbarButton>

              <ToolbarDivider />

              {/* Undo/Redo */}
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo (Ctrl+Z)"
              >
                <Undo size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo (Ctrl+Y)"
              >
                <Redo size={18} />
              </ToolbarButton>
            </div>

            <button
              onClick={onNext}
              disabled={!journalTitle.trim() && editor.isEmpty}
              className="hidden group px-6 py-3 bg-[var(--accent)] text-white rounded-xl sm:flex items-center text-sm font-medium hover:bg-[var(--accent)]/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              Continue
              <ArrowRight
                size={16}
                className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          <input
            ref={titleRef}
            type="text"
            value={journalTitle}
            onChange={(e) => setJournalTitle(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full px-4 py-3 text-xl border-b border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none transition-all duration-200"
          />

          {/* Link Menu */}
          {isLinkMenuOpen && (
            <div className="flex items-center gap-2 p-3 border-x border-[var(--border)] bg-[var(--bg-tertiary)]">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL (e.g., https://example.com)"
                className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setLink();
                  } else if (e.key === "Escape") {
                    setIsLinkMenuOpen(false);
                    setLinkUrl("");
                  }
                }}
              />
              <button
                onClick={setLink}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
              >
                Add Link
              </button>
              {editor.isActive("link") && (
                <button
                  onClick={removeLink}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              )}
              <button
                onClick={() => {
                  setIsLinkMenuOpen(false);
                  setLinkUrl("");
                }}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Image Menu */}
          {isImageMenuOpen && (
            <div className="flex items-center gap-2 p-3 border-x border-[var(--border)] bg-[var(--bg-tertiary)]">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImage();
                  } else if (e.key === "Escape") {
                    setIsImageMenuOpen(false);
                    setImageUrl("");
                  }
                }}
              />
              <button
                onClick={addImage}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
              >
                Add Image
              </button>
              <button
                onClick={() => {
                  setIsImageMenuOpen(false);
                  setImageUrl("");
                }}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Editor Content */}
          <div className="relative rounded-b-xl bg-[var(--bg-primary)]">
            <EditorContent
              editor={editor}
              className="min-h-[450px] sm:min-h-[500px] px-4 py-3 text-[var(--text-primary)] text-base leading-relaxed focus-within:outline-none journal-editor-content"
            />

            {/* Bubble Menu for selected text */}
            {editor && (
              <BubbleMenu
                editor={editor}
                tippyOptions={{
                  duration: 100,
                  placement: "top",
                }}
                className="flex items-center gap-1 p-2 rounded-lg shadow-lg bg-[var(--bg-secondary)] border border-[var(--border)]"
              >
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleBold().run();
                  }}
                  className={`p-2 rounded-md transition-colors ${
                    editor.isActive("bold")
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
                  title="Bold"
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleItalic().run();
                  }}
                  className={`p-2 rounded-md transition-colors ${
                    editor.isActive("italic")
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
                  title="Italic"
                >
                  <Italic size={16} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleUnderline().run();
                  }}
                  className={`p-2 rounded-md transition-colors ${
                    editor.isActive("underline")
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
                  title="Underline"
                >
                  <Underline size={16} />
                </button>
                <div className="w-px h-6 mx-1 bg-[var(--border)]" />
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsLinkMenuOpen(true);
                  }}
                  className={`p-2 rounded-md transition-colors ${
                    editor.isActive("link")
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
                  title="Add Link"
                >
                  <LinkIcon size={16} />
                </button>
              </BubbleMenu>
            )}
          </div>
        </div>

        {/* Footer with word count and status */}
        <div className="flex sm:hidden justify-between items-center pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full opacity-60"></div>
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  {words} words
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full opacity-60"></div>
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  {characters} characters
                </span>
              </div>
              {(journalTitle.trim() || !editor.isEmpty) && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Draft ready
                </span>
              )}
            </div>
            <button
              onClick={onNext}
              disabled={!journalTitle.trim() && editor.isEmpty}
              className="group px-6 py-3 bg-[var(--accent)] text-white rounded-xl flex  items-center text-sm font-medium hover:bg-[var(--accent)]/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              Continue
              <ArrowRight
                size={16}
                className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .journal-editor-content .ProseMirror {
          outline: none;
        }

        .journal-editor-content
          .ProseMirror.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--text-secondary);
          pointer-events: none;
          height: 0;
        }

        .journal-editor-content .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
        }

        .resizable-image-container {
          position: relative;
          display: inline-block;
          margin: 16px 0;
        }

        .resizable-image-container:hover .resize-handle {
          opacity: 0.8 !important;
        }

        .resize-handle {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 20px;
          height: 20px;
          background: var(--accent);
          cursor: se-resize;
          border-radius: 0 0 8px 0;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .resize-handle::before {
          content: "";
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-bottom: 8px solid white;
        }

        .journal-editor-content .ProseMirror blockquote {
          border-left: 4px solid var(--accent);
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          color: var(--text-secondary);
        }

        .journal-editor-content .ProseMirror code {
          background-color: var(--bg-hover);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
        }

        .journal-editor-content .ProseMirror pre {
          background-color: var(--bg-hover);
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;
        }

        .journal-editor-content .ProseMirror pre code {
          background: none;
          padding: 0;
        }

        .journal-editor-content .ProseMirror a {
          color: var(--accent);
          text-decoration: underline;
        }

        .journal-editor-content .ProseMirror a:hover {
          text-decoration: none;
        }

        .journal-editor-content .ProseMirror em {
          font-style: italic !important;
        }

        .journal-editor-content .ProseMirror strong {
          font-weight: bold !important;
        }

        .journal-editor-content .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 24px !important;
          margin: 16px 0 !important;
        }

        .journal-editor-content .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 24px !important;
          margin: 16px 0 !important;
        }

        .journal-editor-content .ProseMirror ul ul {
          list-style-type: circle !important;
        }

        .journal-editor-content .ProseMirror ul ul ul {
          list-style-type: square !important;
        }

        .journal-editor-content .ProseMirror li {
          margin: 4px 0 !important;
          display: list-item !important;
        }

        .journal-editor-content .ProseMirror li p {
          margin: 0 !important;
        }

        .journal-editor-content .ProseMirror h1,
        .journal-editor-content .ProseMirror h2,
        .journal-editor-content .ProseMirror h3 {
          margin: 24px 0 16px 0;
          font-weight: 600;
        }

        .journal-editor-content .ProseMirror h1 {
          font-size: 2em;
        }

        .journal-editor-content .ProseMirror h2 {
          font-size: 1.5em;
        }

        .journal-editor-content .ProseMirror h3 {
          font-size: 1.25em;
        }

        .journal-editor-content .ProseMirror p {
          margin: 12px 0;
        }
      `}</style>
    </div>
  );
};

export default JournalEditor;
