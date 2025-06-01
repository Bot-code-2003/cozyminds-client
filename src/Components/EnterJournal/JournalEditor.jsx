"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  ArrowRight,
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
  AlertCircle,
} from "lucide-react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

// Enhanced Resizable Image Extension with better dimension handling
const ResizableImageExtension = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute("width");
          return width ? Number.parseInt(width, 10) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute("height");
          return height ? Number.parseInt(height, 10) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const container = document.createElement("div");
      container.className = "resizable-image-container";
      container.style.cssText = `
        position: relative;
        display: inline-block;
        margin: 16px 8px 16px 0;
        vertical-align: top;
        min-width: 50px;
        min-height: 50px;
        max-width: 100%;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(156, 163, 175, 0.2);
      `;

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.style.cssText = `
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0;
        margin: 0;
        padding: 0;
      `;

      // Set initial dimensions
      const initialWidth = node.attrs.width || 300;
      const initialHeight = node.attrs.height || 200;

      container.style.width = initialWidth + "px";
      container.style.height = initialHeight + "px";

      // Error handling for broken images
      img.onerror = () => {
        img.style.display = "none";
        const errorDiv = document.createElement("div");
        errorDiv.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: rgba(239, 68, 68, 0.1);
          color: rgba(239, 68, 68, 0.8);
          font-size: 14px;
          text-align: center;
          padding: 16px;
        `;
        errorDiv.innerHTML = `
          <div>
            <div style="margin-bottom: 8px;">⚠️</div>
            <div>Failed to load image</div>
          </div>
        `;
        container.appendChild(errorDiv);
      };

      // Resize handle
      const resizeHandle = document.createElement("div");
      resizeHandle.className = "resize-handle";
      resizeHandle.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 0;
        width: 20px;
        height: 20px;
        background: var(--accent, #3b82f6);
        cursor: se-resize;
        border-radius: 0 0 8px 0;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 10;
      `;

      // Resize handle indicator
      const handleIndicator = document.createElement("div");
      handleIndicator.style.cssText = `
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-bottom: 8px solid white;
        pointer-events: none;
      `;
      resizeHandle.appendChild(handleIndicator);

      // Show/hide handle on hover
      container.addEventListener("mouseenter", () => {
        resizeHandle.style.opacity = "0.8";
      });
      container.addEventListener("mouseleave", () => {
        resizeHandle.style.opacity = "0";
      });

      // Resize functionality with improved handling
      let isResizing = false;
      let startX, startY, startWidth, startHeight, aspectRatio;

      const startResize = (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = Number.parseInt(container.style.width, 10);
        startHeight = Number.parseInt(container.style.height, 10);
        aspectRatio = startWidth / startHeight;

        e.preventDefault();
        e.stopPropagation();

        // Add visual feedback
        container.style.outline = "2px solid var(--accent, #3b82f6)";
        document.body.style.cursor = "se-resize";
        document.body.style.userSelect = "none";
      };

      const doResize = (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Calculate new dimensions
        let newWidth = Math.max(50, startWidth + deltaX);
        let newHeight = Math.max(50, startHeight + deltaY);

        // Maintain aspect ratio if shift is held
        if (e.shiftKey) {
          newHeight = newWidth / aspectRatio;
        }

        // Apply constraints
        const maxWidth = container.parentElement?.offsetWidth || 800;
        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, 600);

        container.style.width = newWidth + "px";
        container.style.height = newHeight + "px";
      };

      const stopResize = () => {
        if (!isResizing) return;

        isResizing = false;

        // Remove visual feedback
        container.style.outline = "none";
        document.body.style.cursor = "";
        document.body.style.userSelect = "";

        const finalWidth = Number.parseInt(container.style.width, 10);
        const finalHeight = Number.parseInt(container.style.height, 10);

        // Update the node attributes
        if (typeof getPos === "function") {
          try {
            editor.commands.updateAttributes("image", {
              width: finalWidth,
              height: finalHeight,
            });
          } catch (error) {
            console.error("Error updating image attributes:", error);
          }
        }
      };

      // Event listeners
      resizeHandle.addEventListener("mousedown", startResize);
      document.addEventListener("mousemove", doResize);
      document.addEventListener("mouseup", stopResize);

      // Cleanup function
      const cleanup = () => {
        document.removeEventListener("mousemove", doResize);
        document.removeEventListener("mouseup", stopResize);
      };

      container.appendChild(img);
      container.appendChild(resizeHandle);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "image") return false;

          try {
            img.src = updatedNode.attrs.src;
            img.alt = updatedNode.attrs.alt || "";

            if (updatedNode.attrs.width) {
              container.style.width = updatedNode.attrs.width + "px";
            }
            if (updatedNode.attrs.height) {
              container.style.height = updatedNode.attrs.height + "px";
            }

            return true;
          } catch (error) {
            console.error("Error updating image node:", error);
            return false;
          }
        },
        destroy: cleanup,
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
  const [imageError, setImageError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validate URL helper
  const isValidUrl = useCallback((string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, []);

  // Validate image URL
  const validateImageUrl = useCallback(
    (url) => {
      if (!url.trim()) return "Please enter an image URL";
      if (!isValidUrl(url)) return "Please enter a valid URL";

      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
        ".bmp",
      ];
      const hasImageExtension = imageExtensions.some((ext) =>
        url.toLowerCase().includes(ext)
      );

      if (!hasImageExtension) {
        return "URL should point to an image file";
      }

      return null;
    },
    [isValidUrl]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      UnderlineExtension,
      CharacterCount.configure({
        limit: null,
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
        validate: (href) => /^https?:\/\//.test(href),
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
      try {
        const html = editor.getHTML();
        setJournalText(html);
      } catch (error) {
        console.error("Error updating journal text:", error);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] max-w-none",
      },
      handleDrop: (view, event, slice, moved) => {
        // Handle image drops
        const files = Array.from(event.dataTransfer?.files || []);
        const imageFiles = files.filter((file) =>
          file.type.startsWith("image/")
        );

        if (imageFiles.length > 0) {
          event.preventDefault();
          // You could implement file upload here
          console.log("Image files dropped:", imageFiles);
          return true;
        }
        return false;
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
      try {
        editor.commands.setContent(journalText || "");
      } catch (error) {
        console.error("Error setting editor content:", error);
      }
    }
  }, [editor, journalText]);

  const setLink = useCallback(() => {
    if (!editor) return;

    try {
      if (linkUrl.trim()) {
        const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
        if (isValidUrl(url)) {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        } else {
          alert("Please enter a valid URL");
          return;
        }
      } else {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      }

      setIsLinkMenuOpen(false);
      setLinkUrl("");
    } catch (error) {
      console.error("Error setting link:", error);
      alert("Failed to add link. Please try again.");
    }
  }, [editor, linkUrl, isValidUrl]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    try {
      editor.chain().focus().unsetLink().run();
      setIsLinkMenuOpen(false);
    } catch (error) {
      console.error("Error removing link:", error);
    }
  }, [editor]);

  const addImage = useCallback(async () => {
    if (!editor || !imageUrl.trim()) return;

    const validationError = validateImageUrl(imageUrl);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    setIsLoading(true);
    setImageError("");

    try {
      // Test if image loads
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Add image to editor
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          width: 300,
          height: 200,
        })
        .run();

      setIsImageMenuOpen(false);
      setImageUrl("");
      setImageError("");
    } catch (error) {
      console.error("Error loading image:", error);
      setImageError(
        "Failed to load image. Please check the URL and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [editor, imageUrl, validateImageUrl]);

  const ToolbarButton = ({ onClick, active, disabled, children, title }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onClick();
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
      <div className="mx-auto space-y-2 max-w-5xl">
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

  // Get word and character counts safely
  const characterCount = editor.storage.characterCount || {};
  const words = characterCount.words ? characterCount.words() : 0;
  const characters = characterCount.characters
    ? characterCount.characters()
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-2">
      {/* Main Editor Card */}
      <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-sm">
        {/* Content Section */}
        <div className="mb-6">
          {/* Rich Text Editor Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-1 p-3 mb-0 border border-[var(--border)] rounded-t-xl bg-[var(--bg-secondary)] border-b-0">
            {/* Text Formatting */}
            <div className="flex items-center flex-wrap gap-1">
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
            maxLength={200}
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
            <div className="p-3 border-x border-[var(--border)] bg-[var(--bg-tertiary)] space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageError("");
                  }}
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
                      setImageError("");
                    }
                  }}
                />
                <button
                  onClick={addImage}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] rounded-lg hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Add Image"}
                </button>
                <button
                  onClick={() => {
                    setIsImageMenuOpen(false);
                    setImageUrl("");
                    setImageError("");
                  }}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {imageError && (
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle size={16} />
                  <span>{imageError}</span>
                </div>
              )}

              <div className="text-xs text-[var(--text-secondary)]">
                <p>💡 Tips:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Use direct image URLs (ending in .jpg, .png, etc.)</li>
                  <li>Drag the corner handle to resize images</li>
                  <li>Hold Shift while resizing to maintain aspect ratio</li>
                </ul>
              </div>
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
        <div className="flex sm:hidden justify-between items-center p-4 border-t border-[var(--border)]">
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
              className="group px-6 py-3 bg-[var(--accent)] text-white rounded-xl flex items-center text-sm font-medium hover:bg-[var(--accent)]/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
          margin: 16px 8px 16px 0;
          vertical-align: top;
          min-width: 50px;
          min-height: 50px;
          max-width: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(156, 163, 175, 0.2);
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
          background: var(--accent, #3b82f6);
          cursor: se-resize;
          border-radius: 0 0 8px 0;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 10;
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
          pointer-events: none;
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

        /* Selection styles */
        .journal-editor-content .ProseMirror ::selection {
          background: var(--accent, #3b82f6);
          color: white;
        }

        /* Focus styles */
        .journal-editor-content .ProseMirror:focus {
          outline: none;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .resizable-image-container {
            max-width: 100% !important;
            margin: 16px 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default JournalEditor;
