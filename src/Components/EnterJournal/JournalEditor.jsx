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
  LinkIcon,
  ImageIcon,
  Quote,
  Undo,
  Redo,
  Type,
  X,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

// Enhanced Full-Width Image Extension with better cursor positioning
const FullWidthImageExtension = ImageExtension.extend({
  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const container = document.createElement("div");
      container.className = "full-width-image-container";
      container.style.cssText = `
        position: relative;
        display: block;
        width: 100%;
        margin: 32px 0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(156, 163, 175, 0.2);
        background: transparent;
      `;

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.style.cssText = `
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  max-height: 500px;
  border-radius: 12px;
  margin: 0 auto;
  background: transparent;
`;

      // Error handling for broken images
      img.onerror = () => {
        container.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: rgba(239, 68, 68, 0.8);
            text-align: center;
            min-height: 200px;
          ">
            <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
            <div style="font-size: 14px;">Failed to load image</div>
          </div>
        `;
      };

      container.appendChild(img);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "image") return false;
          try {
            img.src = updatedNode.attrs.src;
            img.alt = updatedNode.attrs.alt || "";
            return true;
          } catch (error) {
            console.error("Error updating image node:", error);
            return false;
          }
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
        paragraph: {
          HTMLAttributes: {
            class: "editor-paragraph",
          },
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
      FullWidthImageExtension.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "full-width-image",
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

  const addImage = useCallback(() => {
    if (!editor || !imageUrl.trim()) return;

    const validationError = validateImageUrl(imageUrl);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    setIsLoading(true);
    setImageError("");

    try {
      // Directly add the image URL to the editor without pre-loading
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl, // Use the raw URL provided by the user
        })
        .run();

      // Add a paragraph after the image and position cursor there
      setTimeout(() => {
        editor.chain().focus().createParagraphNear().focus().run();
      }, 100);

      setIsImageMenuOpen(false);
      setImageUrl("");
      setImageError("");
    } catch (error) {
      console.error("Error adding image:", error);
      setImageError("Failed to add image. Please try again.");
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
      <div className="mx-auto space-y-2 max-w-4xl">
        <div className="bg-[var(--bg-secondary)] rounded-apple border border-[var(--border)] p-6">
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
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Main Editor Card */}
      <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
        {/* Content Section */}
        <div className="mb-4">
          {/* Rich Text Editor Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 p-2 sm:p-4 mb-0 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
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

              {/* Special Formatting */}
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive("blockquote")}
                title="Quote"
              >
                <Quote size={18} />
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
                title="Add Full-Width Image"
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
          </div>

          <input
            ref={titleRef}
            type="text"
            value={journalTitle}
            onChange={(e) => setJournalTitle(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl font-medium border-b border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none transition-all duration-200"
            maxLength={200}
          />

          {/* Link Menu */}
          {isLinkMenuOpen && (
            <div className="flex flex-col sm:flex-row items-center gap-2 p-3 sm:p-4 border-x border-[var(--border)] bg-[var(--bg-tertiary)]">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL (e.g., https://example.com)"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-[var(--border)] rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
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
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={setLink}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-white bg-[var(--accent)] rounded-xl hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Add Link
                </button>
                {editor.isActive("link") && (
                  <button
                    onClick={removeLink}
                    className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-[var(--error)] bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Remove
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsLinkMenuOpen(false);
                    setLinkUrl("");
                  }}
                  className="p-2 sm:p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Image Menu */}
          {isImageMenuOpen && (
            <div className="p-3 sm:p-4 border-x border-[var(--border)] bg-[var(--bg-tertiary)]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageError("");
                    }}
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-[var(--border)] rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
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
                  <div className="flex gap-2">
                    <button
                      onClick={addImage}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-white bg-[var(--accent)] rounded-xl hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Loading..." : "Add Image"}
                    </button>
                    <button
                      onClick={() => {
                        setIsImageMenuOpen(false);
                        setImageUrl("");
                        setImageError("");
                      }}
                      className="p-2 sm:p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {imageError && (
                <div className="mt-3 sm:mt-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl text-[var(--error)] text-sm">
                  <AlertCircle size={16} />
                  <span>{imageError}</span>
                </div>
              )}

              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                    <Edit3 size={16} className="text-[var(--accent)]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Image Tips</h4>
                    <ul className="space-y-1.5 sm:space-y-2 text-sm text-[var(--text-secondary)]">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent)]">•</span>
                        <span>Images will appear full-width in your journal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent)]">•</span>
                        <span>Cursor will automatically move below the image</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent)]">•</span>
                        <span>Use direct image URLs (ending in .jpg, .png, etc.)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Editor Content */}
          <div className="relative rounded-b-2xl bg-[var(--bg-primary)]">
            <EditorContent
              editor={editor}
              className="min-h-[450px] sm:min-h-[500px] px-3 sm:px-6 py-3 sm:py-4 text-[var(--text-primary)] text-base leading-relaxed focus-within:outline-none journal-editor-content"
            />

            {/* Bubble Menu for selected text */}
            {editor && (
              <BubbleMenu
                editor={editor}
                tippyOptions={{
                  duration: 100,
                  placement: "top",
                }}
                className="flex items-center gap-1.5 p-2 rounded-xl shadow-lg bg-[var(--bg-secondary)] border border-[var(--border)]"
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
        <div className="flex justify-between items-center p-3 sm:p-6 border-t border-[var(--border)]">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4">
              {(journalTitle.trim() || !editor.isEmpty) && (
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[var(--success)]/10 text-[var(--success)] text-sm font-medium rounded-full">
                  Draft ready
                </span>
              )}
            </div>
            <button
              onClick={onNext}
              disabled={!journalTitle.trim() && editor.isEmpty}
              className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--accent)] text-white rounded-xl flex items-center text-sm font-medium hover:bg-[var(--accent-hover)] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
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

        .journal-editor-content .ProseMirror.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--text-secondary);
          pointer-events: none;
          height: 0;
        }

        /* Enhanced paragraph spacing */
        .journal-editor-content .ProseMirror .editor-paragraph {
          margin: 24px 0 !important;
          line-height: 1.8 !important;
          font-size: 1.125rem;
          color: var(--text-primary);
        }

        .journal-editor-content .ProseMirror .editor-paragraph:first-child {
          margin-top: 0 !important;
        }

        .journal-editor-content .ProseMirror .editor-paragraph:last-child {
          margin-bottom: 0 !important;
        }

        /* Full-width image styling with better spacing */
        .full-width-image-container {
          position: relative;
          display: block;
          width: 100%;
          margin: 40px 0 !important;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border);
          background: var(--bg-primary);
        }

        /* Ensure proper spacing after images */
        .full-width-image-container + p {
          margin-top: 40px !important;
        }

        .journal-editor-content .ProseMirror blockquote {
          border-left: 4px solid var(--accent);
          padding: 16px 24px;
          margin: 32px 0;
          font-style: italic;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          border-radius: 0 12px 12px 0;
        }

        .journal-editor-content .ProseMirror code {
          background-color: var(--bg-hover);
          padding: 3px 8px;
          border-radius: 6px;
          font-family: "SF Mono", "Monaco", "Menlo", "Ubuntu Mono", monospace;
          font-size: 0.9em;
          color: var(--text-primary);
        }

        .journal-editor-content .ProseMirror pre {
          background-color: var(--bg-hover);
          padding: 20px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 32px 0;
          border: 1px solid var(--border);
        }

        .journal-editor-content .ProseMirror pre code {
          background: none;
          padding: 0;
        }

        .journal-editor-content .ProseMirror a {
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px solid var(--accent);
          transition: all 0.2s ease;
        }

        .journal-editor-content .ProseMirror a:hover {
          opacity: 0.8;
        }

        .journal-editor-content .ProseMirror em {
          font-style: italic !important;
        }

        .journal-editor-content .ProseMirror strong {
          font-weight: 600 !important;
        }

        .journal-editor-content .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 28px !important;
          margin: 24px 0 !important;
        }

        .journal-editor-content .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 28px !important;
          margin: 24px 0 !important;
        }

        .journal-editor-content .ProseMirror ul ul {
          list-style-type: circle !important;
        }

        .journal-editor-content .ProseMirror ul ul ul {
          list-style-type: square !important;
        }

        .journal-editor-content .ProseMirror li {
          margin: 8px 0 !important;
          display: list-item !important;
          color: var(--text-primary);
        }

        .journal-editor-content .ProseMirror li p {
          margin: 0 !important;
        }

        .journal-editor-content .ProseMirror h1,
        .journal-editor-content .ProseMirror h2,
        .journal-editor-content .ProseMirror h3 {
          margin: 40px 0 24px 0;
          font-weight: 600;
          line-height: 1.3;
          color: var(--text-primary);
        }

        .journal-editor-content .ProseMirror h1 {
          font-size: 2.5em;
        }

        .journal-editor-content .ProseMirror h2 {
          font-size: 2em;
        }

        .journal-editor-content .ProseMirror h3 {
          font-size: 1.5em;
        }

        .journal-editor-content .ProseMirror p {
          margin: 24px 0;
        }

        /* Selection styles */
        .journal-editor-content .ProseMirror ::selection {
          background: var(--accent);
          color: white;
        }

        /* Focus styles */
        .journal-editor-content .ProseMirror:focus {
          outline: none;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .full-width-image-container {
            margin: 32px 0 !important;
          }
          
          .journal-editor-content .ProseMirror h1 {
            font-size: 2em;
          }
          
          .journal-editor-content .ProseMirror h2 {
            font-size: 1.75em;
          }
          
          .journal-editor-content .ProseMirror h3 {
            font-size: 1.35em;
          }
        }
      `}</style>
    </div>
  );
};

export default JournalEditor;