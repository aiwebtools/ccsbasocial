import React, { useState } from 'react';
import { Heart, ThumbsUp, MessageCircle, Trash2, AlertTriangle, Send, User } from 'lucide-react';

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface Author {
  name: string;
  email: string;
  avatar?: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
}

interface PostProps {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  image?: string;
  video?: string;
  link?: string;
  linkPreview?: LinkPreview;
  likes: number;
  thumbsUp: number;
  comments?: Comment[];
  onLike: (id: string, authorEmail: string) => void;
  onThumbsUp: (id: string, authorEmail: string) => void;
  onComment?: (postId: string, content: string) => void;
  onInteraction: () => void;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onWarn?: (id: string, authorEmail: string) => void;
}

export default function Post({
  id,
  author,
  content,
  timestamp,
  image,
  video,
  link,
  linkPreview,
  likes,
  thumbsUp,
  comments = [],
  onLike,
  onThumbsUp,
  onComment,
  onInteraction,
  isAdmin,
  onDelete,
  onWarn
}: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showWarnConfirm, setShowWarnConfirm] = useState(false);

  const handleLike = () => {
    onLike(id, author.email);
    onInteraction();
  };

  const handleThumbsUp = () => {
    onThumbsUp(id, author.email);
    onInteraction();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && onComment) {
      onComment(id, commentText.trim());
      setCommentText('');
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
      setShowDeleteConfirm(false);
    }
  };

  const handleWarn = () => {
    if (onWarn) {
      onWarn(id, author.email);
      setShowWarnConfirm(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex items-center mb-4">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-12 h-12 rounded-full mr-4"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#A3C3A3] flex items-center justify-center mr-4">
            <User className="h-6 w-6 text-[#1C563D]" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{author.name}</h3>
          <p className="text-gray-500 text-sm">{formatTimestamp(timestamp)}</p>
        </div>
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowWarnConfirm(true)}
              className="text-yellow-500 hover:text-yellow-600 p-2 rounded-full hover:bg-yellow-50"
              title="Warn User"
            >
              <AlertTriangle size={20} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
              title="Delete Post"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-800 mb-4">{content}</p>

      {image && (
        <img
          src={image}
          alt="Post content"
          className="rounded-lg mb-4 max-h-96 w-full object-cover"
        />
      )}

      {video && (
        <video
          src={video}
          controls
          className="rounded-lg mb-4 max-h-96 w-full"
        />
      )}

      {linkPreview && (
        <a
          href={linkPreview.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 border border-gray-200 rounded-lg overflow-hidden hover:border-[#1C563D] transition-colors"
        >
          <div className="flex">
            {linkPreview.image && (
              <div className="flex-shrink-0 w-48">
                <img 
                  src={linkPreview.image} 
                  alt={linkPreview.title}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
            <div className="flex-1 p-4">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {linkPreview.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {linkPreview.description}
              </p>
              <p className="text-sm text-[#1C563D] mt-1 truncate">
                {linkPreview.url}
              </p>
            </div>
          </div>
        </a>
      )}

      {link && !linkPreview && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 p-3 bg-gray-50 rounded-lg text-[#1C563D] hover:underline break-all"
        >
          {link}
        </a>
      )}

      <div className="flex items-center space-x-6 text-gray-500">
        <button
          onClick={handleLike}
          className="flex items-center space-x-2 hover:text-red-500 transition-colors"
        >
          <Heart size={20} />
          <span>{likes}</span>
        </button>
        <button
          onClick={handleThumbsUp}
          className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
        >
          <ThumbsUp size={20} />
          <span>{thumbsUp}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={20} />
          <span>{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4">
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1C563D] focus:ring-1 focus:ring-[#1C563D]"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="bg-[#1C563D] text-white px-4 py-2 rounded-lg hover:bg-[#164430] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Comment</span>
              </button>
            </div>
          </form>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#A3C3A3] flex items-center justify-center">
                    <User className="h-4 w-4 text-[#1C563D]" />
                  </div>
                )}
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Post
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warn User Modal */}
      {showWarnConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Warn User
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to send a warning to this user about their post?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowWarnConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleWarn}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
              >
                Send Warning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}