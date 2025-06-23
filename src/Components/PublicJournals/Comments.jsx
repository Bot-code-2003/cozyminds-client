"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart, MessageCircle, MoreVertical, Edit3, Trash2, Send, Loader2, Reply } from "lucide-react"

const Comments = ({ journalId, currentUser, onLoginRequired }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [replyingToName, setReplyingToName] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState("")
  const [showDropdown, setShowDropdown] = useState(null)
  const isDevGod = currentUser && (currentUser.anonymousName === "ComfyNoodleUwU" || currentUser.username === "ComfyNoodleUwU")
  const [devAuthor, setDevAuthor] = useState("")
  const [devDate, setDevDate] = useState("")
  const [devContent, setDevContent] = useState("")
  const [devLikes, setDevLikes] = useState(0)
  const [devSubmitting, setDevSubmitting] = useState(false)
  const [devReplyStates, setDevReplyStates] = useState({})

  const API_BASE = import.meta.env.VITE_API_URL

  // Fetch comments
  const fetchComments = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        if (pageNum === 1) setLoading(true)
        else setLoadingMore(true)

        const response = await fetch(`${API_BASE}/comments/${journalId}?page=${pageNum}&limit=10`)
        const data = await response.json()

        if (response.ok) {
          if (append) {
            setComments((prev) => [...prev, ...data.comments])
          } else {
            setComments(data.comments)
          }
          setHasMore(data.hasMore)
          setPage(pageNum)
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [journalId, API_BASE],
  )

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Submit new comment
  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      onLoginRequired()
      return
    }
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journalId,
          userId: currentUser._id,
          content: newComment.trim(),
          authorName: currentUser.anonymousName || currentUser.username,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments((prev) => [data.comment, ...prev])
        setNewComment("")
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  // Submit reply
  const handleSubmitReply = async (parentId, replyToName) => {
    if (!currentUser) {
      onLoginRequired()
      return
    }

    let content = replyText.trim()
    if (!content) return

    // Add @mention if not already included
    if (replyToName && !content.startsWith(`@${replyToName}`)) {
      content = `@${replyToName} ${content}`
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journalId,
          userId: currentUser._id,
          content,
          authorName: currentUser.anonymousName || currentUser.username,
          parentId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments((prev) => [data.comment, ...prev])
        setReplyText("")
        setReplyingTo(null)
        setReplyingToName("")
      }
    } catch (error) {
      console.error("Error submitting reply:", error)
    } finally {
      setSubmitting(false)
    }
  }

  // Like comment
  const handleLikeComment = async (commentId) => {
    if (!currentUser) {
      onLoginRequired()
      return
    }

    try {
      const response = await fetch(`${API_BASE}/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likeCount: data.likeCount,
                  likes: data.isLiked
                    ? [...(comment.likes || []), currentUser._id]
                    : (comment.likes || []).filter((id) => id !== currentUser._id),
                }
              : comment,
          ),
        )
      }
    } catch (error) {
      console.error("Error liking comment:", error)
    }
  }

  // Edit comment
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return

    try {
      const response = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          content: editText.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments((prev) => prev.map((comment) => (comment._id === commentId ? data.comment : comment)))
        setEditingComment(null)
        setEditText("")
      }
    } catch (error) {
      console.error("Error editing comment:", error)
    }
  }

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const response = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id }),
      })

      if (response.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentId && comment.parentId !== commentId))
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  // Load more comments
  const handleLoadMore = () => {
    fetchComments(page + 1, true)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  // Get user avatar
  const getUserAvatar = (authorName) => {
    return authorName?.charAt(0).toUpperCase() || "A"
  }

  // Get random gradient for avatar
  const getAvatarGradient = (authorName) => {
    if (!authorName) return "from-blue-500 to-purple-500"

    const gradients = [
      "from-blue-500 to-purple-500",
      "from-green-500 to-blue-500",
      "from-yellow-500 to-orange-500",
      "from-pink-500 to-red-500",
      "from-purple-500 to-pink-500",
      "from-indigo-500 to-blue-500",
      "from-red-500 to-orange-500",
      "from-teal-500 to-green-500",
    ]

    // Use the sum of character codes to determine a consistent gradient
    const charSum = authorName.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return gradients[charSum % gradients.length]
  }

  // Format comment content to highlight mentions
  const formatCommentContent = (content) => {
    if (!content) return ""

    // Replace @mentions with styled spans
    return content.replace(/@(\w+)/g, '<span class="text-blue-600 dark:text-blue-400 font-medium">@$1</span>')
  }

  // Separate parent comments and replies
  const parentComments = comments.filter((comment) => !comment.parentId)
  const getReplies = (parentId) => comments.filter((comment) => comment.parentId === parentId)

  // Find comment by ID
  const findCommentById = (id) => comments.find((comment) => comment._id === id)

  // Helper to add a dev comment
  const handleDevSubmit = async (e) => {
    e.preventDefault()
    if (!devAuthor.trim() || !devContent.trim()) return
    setDevSubmitting(true)
    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journalId,
          userId: currentUser._id,
          content: devContent.trim(),
          authorName: devAuthor.trim(),
        }),
      })
      if (response.ok) {
        const data = await response.json()
        // Inject dev fields into the comment object
        const devComment = {
          ...data.comment,
          authorName: devAuthor.trim(),
          createdAt: devDate && devDate !== "now" ? devDate : new Date().toISOString(),
          likeCount: Number(devLikes) || 0,
          likes: [], // fake likes, not real user IDs
          isDevGod: true,
        }
        setComments((prev) => [devComment, ...prev])
        setDevAuthor("")
        setDevDate("")
        setDevContent("")
        setDevLikes(0)
      }
    } catch (error) {
      console.error("Error submitting dev comment:", error)
    } finally {
      setDevSubmitting(false)
    }
  }

  // Helper to open/close dev reply form
  const openDevReplyForm = (parentId) => {
    setDevReplyStates((prev) => ({
      ...prev,
      [parentId]: {
        open: true,
        author: '',
        date: '',
        content: '',
        likes: 0,
        submitting: false,
      },
    }));
  };
  const closeDevReplyForm = (parentId) => {
    setDevReplyStates((prev) => ({ ...prev, [parentId]: { ...prev[parentId], open: false } }));
  };
  const updateDevReplyField = (parentId, field, value) => {
    setDevReplyStates((prev) => ({
      ...prev,
      [parentId]: { ...prev[parentId], [field]: value },
    }));
  };

  // Helper to add a dev reply
  const handleDevReplySubmit = async (e, parentId, replyToName) => {
    e.preventDefault();
    const state = devReplyStates[parentId];
    if (!state || !state.author.trim() || !state.content.trim()) return;
    updateDevReplyField(parentId, 'submitting', true);
    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journalId,
          userId: currentUser._id,
          content: replyToName && !state.content.startsWith(`@${replyToName}`) ? `@${replyToName} ${state.content.trim()}` : state.content.trim(),
          authorName: state.author.trim(),
          parentId,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const devReply = {
          ...data.comment,
          authorName: state.author.trim(),
          createdAt: state.date && state.date !== 'now' ? state.date : new Date().toISOString(),
          likeCount: Number(state.likes) || 0,
          likes: [],
          isDevGod: true,
        };
        setComments((prev) => [devReply, ...prev]);
        closeDevReplyForm(parentId);
      }
    } catch (error) {
      console.error('Error submitting dev reply:', error);
    } finally {
      updateDevReplyField(parentId, 'submitting', false);
    }
  };

  if (loading) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">Loading comments...</span>
        </div>
      </div>
    )
  }

  return (
    <div id="comments" className="border-t mb-10 border-gray-200 dark:border-gray-700">
      {/* Comments Header */}
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h3>
      </div>

      {/* Add Comment Form */}
      <div className="px-6 pb-6">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex gap-3">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(currentUser?.anonymousName || currentUser?.username)} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
            >
              {currentUser ? getUserAvatar(currentUser.anonymousName || currentUser.username) : "?"}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={currentUser ? "Add a comment..." : "Please log in to comment"}
                disabled={!currentUser}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              {newComment.trim() && (
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setNewComment("")}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Comment
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Developer God Mode Comment Form */}
      {isDevGod && (
        <div className="px-6 pb-2">
          <form onSubmit={handleDevSubmit} className="space-y-2 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700 mb-4">
            <div className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">Developer God Mode: Manual Comment</div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                className="flex-1 p-2 border rounded"
                placeholder="Author Name"
                value={devAuthor}
                onChange={e => setDevAuthor(e.target.value)}
              />
              <input
                type="text"
                className="flex-1 p-2 border rounded"
                placeholder="Date (ISO or 'now')"
                value={devDate}
                onChange={e => setDevDate(e.target.value)}
              />
              <input
                type="number"
                className="w-32 p-2 border rounded"
                placeholder="Likes"
                value={devLikes}
                min={0}
                onChange={e => setDevLikes(e.target.value)}
              />
            </div>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Comment Content"
              value={devContent}
              onChange={e => setDevContent(e.target.value)}
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={devSubmitting}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                {devSubmitting ? "Submitting..." : "Add Dev Comment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="px-6 space-y-6">
        {parentComments.map((comment) => {
          const replies = getReplies(comment._id)
          const isLiked = currentUser && comment.likes?.includes(currentUser._id)
          const isOwner = currentUser && comment.userId === currentUser._id
          // DEV: override likeCount and createdAt if isDevGod
          const displayLikeCount = comment.isDevGod ? comment.likeCount : (comment.likeCount || 0)
          const displayCreatedAt = comment.isDevGod ? comment.createdAt : comment.createdAt

          return (
            <div key={comment._id} className="space-y-4">
              {/* Main Comment */}
              <div className="flex gap-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(comment.authorName)} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                >
                  {getUserAvatar(comment.authorName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                            {comment.authorName}
                          </span>
                        </div>

                        {editingComment === comment._id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm resize-none"
                              rows="2"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditComment(comment._id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingComment(null)
                                  setEditText("")
                                }}
                                className="px-3 py-1 text-gray-600 dark:text-gray-400 text-xs hover:text-gray-800 dark:hover:text-gray-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p
                            className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatCommentContent(comment.content) }}
                          />
                        )}
                      </div>

                      {isOwner && editingComment !== comment._id && (
                        <div className="relative">
                          <button
                            onClick={() => setShowDropdown(showDropdown === comment._id ? null : comment._id)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {showDropdown === comment._id && (
                            <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                              <button
                                onClick={() => {
                                  setEditingComment(comment._id)
                                  setEditText(comment.content)
                                  setShowDropdown(null)
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <Edit3 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteComment(comment._id)
                                  setShowDropdown(null)
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4 mt-2 ml-4">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                        isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      {displayLikeCount}
                    </button>

                    <button
                      onClick={() => {
                        if (!currentUser) {
                          onLoginRequired()
                          return
                        }
                        setReplyingTo(replyingTo === comment._id ? null : comment._id)
                        setReplyingToName(comment.authorName)
                        setReplyText("")
                      }}
                      className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-blue-500 flex items-center gap-1"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-3 ml-4">
                      <div className="flex gap-2">
                        <div
                          className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient(currentUser?.anonymousName || currentUser?.username)} rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0`}
                        >
                          {getUserAvatar(currentUser?.anonymousName || currentUser?.username)}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${replyingToName}...`}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none"
                            rows="2"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyText("")
                                setReplyingToName("")
                              }}
                              className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSubmitReply(comment._id, replyingToName)}
                              disabled={!replyText.trim() || submitting}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dev Reply Form */}
                  {isDevGod && (
                    <div className="mt-2 ml-4">
                      {devReplyStates[comment._id]?.open ? (
                        <form
                          onSubmit={e => handleDevReplySubmit(e, comment._id, comment.authorName)}
                          className="space-y-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-300 dark:border-yellow-700 mb-2"
                        >
                          <div className="font-bold text-yellow-800 dark:text-yellow-200 mb-1">Dev Reply</div>
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                              type="text"
                              className="flex-1 p-2 border rounded"
                              placeholder="Author Name"
                              value={devReplyStates[comment._id]?.author || ''}
                              onChange={e => updateDevReplyField(comment._id, 'author', e.target.value)}
                            />
                            <input
                              type="text"
                              className="flex-1 p-2 border rounded"
                              placeholder="Date (ISO or 'now')"
                              value={devReplyStates[comment._id]?.date || ''}
                              onChange={e => updateDevReplyField(comment._id, 'date', e.target.value)}
                            />
                            <input
                              type="number"
                              className="w-32 p-2 border rounded"
                              placeholder="Likes"
                              value={devReplyStates[comment._id]?.likes || 0}
                              min={0}
                              onChange={e => updateDevReplyField(comment._id, 'likes', e.target.value)}
                            />
                          </div>
                          <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Reply Content"
                            value={devReplyStates[comment._id]?.content || ''}
                            onChange={e => updateDevReplyField(comment._id, 'content', e.target.value)}
                            rows={2}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => closeDevReplyForm(comment._id)}
                              className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={devReplyStates[comment._id]?.submitting}
                              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                            >
                              {devReplyStates[comment._id]?.submitting ? 'Submitting...' : 'Add Dev Reply'}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => openDevReplyForm(comment._id)}
                          className="text-xs font-medium text-yellow-700 dark:text-yellow-200 hover:underline ml-2"
                        >
                          + Dev Reply
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {replies.length > 0 && (
                <div className="ml-12 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                  {replies.map((reply) => {
                    const isReplyLiked = currentUser && reply.likes?.includes(currentUser._id)
                    const isReplyOwner = currentUser && reply.userId === currentUser._id

                    return (
                      <div key={reply._id} className="flex gap-3">
                        <div
                          className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient(reply.authorName)} rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0`}
                        >
                          {getUserAvatar(reply.authorName)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs">
                                    {reply.authorName}
                                  </span>
                                </div>
                                <p
                                  className="text-gray-800 dark:text-gray-200 text-xs leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: formatCommentContent(reply.content) }}
                                />
                              </div>

                              {isReplyOwner && (
                                <div className="relative">
                                  <button
                                    onClick={() => setShowDropdown(showDropdown === reply._id ? null : reply._id)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                                  >
                                    <MoreVertical className="w-3 h-3" />
                                  </button>

                                  {showDropdown === reply._id && (
                                    <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                      <button
                                        onClick={() => {
                                          handleDeleteComment(reply._id)
                                          setShowDropdown(null)
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-1 ml-3">
                            <button
                              onClick={() => handleLikeComment(reply._id)}
                              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                                isReplyLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400 hover:text-red-500"
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${isReplyLiked ? "fill-current" : ""}`} />
                              {reply.likeCount || 0}
                            </button>

                            <button
                              onClick={() => {
                                if (!currentUser) {
                                  onLoginRequired()
                                  return
                                }
                                setReplyingTo(replyingTo === comment._id ? null : comment._id)
                                setReplyingToName(reply.authorName)
                                setReplyText("")
                              }}
                              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-blue-500 flex items-center gap-1"
                            >
                              <Reply className="w-3 h-3" />
                              Reply
                            </button>
                          </div>

                          {/* Dev Reply Form */}
                          {isDevGod && (
                            <div className="mt-2 ml-4">
                              {devReplyStates[reply._id]?.open ? (
                                <form
                                  onSubmit={e => handleDevReplySubmit(e, reply._id, replyingToName)}
                                  className="space-y-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-300 dark:border-yellow-700 mb-2"
                                >
                                  <div className="font-bold text-yellow-800 dark:text-yellow-200 mb-1">Dev Reply</div>
                                  <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                      type="text"
                                      className="flex-1 p-2 border rounded"
                                      placeholder="Author Name"
                                      value={devReplyStates[reply._id]?.author || ''}
                                      onChange={e => updateDevReplyField(reply._id, 'author', e.target.value)}
                                    />
                                    <input
                                      type="text"
                                      className="flex-1 p-2 border rounded"
                                      placeholder="Date (ISO or 'now')"
                                      value={devReplyStates[reply._id]?.date || ''}
                                      onChange={e => updateDevReplyField(reply._id, 'date', e.target.value)}
                                    />
                                    <input
                                      type="number"
                                      className="w-32 p-2 border rounded"
                                      placeholder="Likes"
                                      value={devReplyStates[reply._id]?.likes || 0}
                                      min={0}
                                      onChange={e => updateDevReplyField(reply._id, 'likes', e.target.value)}
                                    />
                                  </div>
                                  <textarea
                                    className="w-full p-2 border rounded"
                                    placeholder="Reply Content"
                                    value={devReplyStates[reply._id]?.content || ''}
                                    onChange={e => updateDevReplyField(reply._id, 'content', e.target.value)}
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => closeDevReplyForm(reply._id)}
                                      className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={devReplyStates[reply._id]?.submitting}
                                      className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                                    >
                                      {devReplyStates[reply._id]?.submitting ? 'Submitting...' : 'Add Dev Reply'}
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <button
                                  onClick={() => openDevReplyForm(reply._id)}
                                  className="text-xs font-medium text-yellow-700 dark:text-yellow-200 hover:underline ml-2"
                                >
                                  + Dev Reply
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="p-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto font-medium"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>Load more comments</>
            )}
          </button>
        </div>
      )}

      {/* No Comments State */}
      {comments.length === 0 && (
        <div className="p-6 text-center">
          <MessageCircle className="w-12 h-12 text-gray-500 dark:text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {showDropdown && <div className="fixed inset-0 z-0" onClick={() => setShowDropdown(null)} />}
    </div>
  )
}

export default Comments
