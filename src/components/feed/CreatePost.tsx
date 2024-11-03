import React, { useState, useRef } from 'react';
import { Image, Video, Link, Send, X } from 'lucide-react';

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface CreatePostProps {
  onPost: (content: string, image?: string, video?: string, link?: string, linkPreview?: LinkPreview) => void;
}

export default function CreatePost({ onPost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [video, setVideo] = useState<string | undefined>();
  const [link, setLink] = useState<string | undefined>();
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideo(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchLinkPreview = async (url: string) => {
    try {
      setIsLoadingPreview(true);
      const response = await fetch(`https://api.linkpreview.net/?key=838cec443271fa00e61c663d6f6eedb7&q=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setLinkPreview({
        title: data.title || '',
        description: data.description || '',
        image: data.image || '',
        url: url
      });
    } catch (error) {
      console.error('Error fetching link preview:', error);
      // Fallback to basic preview
      setLinkPreview({
        title: url,
        description: '',
        image: '',
        url: url
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (linkInput.trim()) {
      let formattedLink = linkInput;
      if (!/^https?:\/\//i.test(linkInput)) {
        formattedLink = `https://${linkInput}`;
      }
      setLink(formattedLink);
      await fetchLinkPreview(formattedLink);
      setLinkInput('');
      setShowLinkInput(false);
    }
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onPost(content, image, video, link, linkPreview || undefined);
      setContent('');
      setImage(undefined);
      setVideo(undefined);
      setLink(undefined);
      setLinkPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeVideo = () => {
    setVideo(undefined);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeLink = () => {
    setLink(undefined);
    setLinkPreview(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start space-x-4">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
        <div className="flex-1">
          <textarea
            placeholder="Share your thoughts with the community..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1C563D] resize-none"
            rows={3}
          />
          
          {isUploading && (
            <div className="mt-2 p-2 text-sm text-gray-600">
              Uploading media...
            </div>
          )}

          {image && (
            <div className="mt-2 relative inline-block">
              <img 
                src={image} 
                alt="Upload preview" 
                className="max-h-48 rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {video && (
            <div className="mt-2 relative inline-block">
              <video 
                src={video}
                controls
                className="max-h-48 rounded-lg"
              />
              <button
                onClick={removeVideo}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {linkPreview && (
            <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex">
                {linkPreview.image && (
                  <div className="flex-shrink-0 w-32">
                    <img 
                      src={linkPreview.image} 
                      alt={linkPreview.title}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {linkPreview.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {linkPreview.description}
                      </p>
                      <a 
                        href={linkPreview.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#1C563D] hover:underline mt-1 block truncate"
                      >
                        {linkPreview.url}
                      </a>
                    </div>
                    <button
                      onClick={removeLink}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoadingPreview && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1C563D] border-t-transparent"></div>
                <span className="text-sm text-gray-600">Loading link preview...</span>
              </div>
            </div>
          )}

          {showLinkInput && !linkPreview && (
            <form onSubmit={handleLinkSubmit} className="mt-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Enter URL..."
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1C563D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C563D] text-white rounded-lg hover:bg-[#164430]"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkInput(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-[#1C563D] rounded-full hover:bg-gray-100 transition-colors"
                title="Add image"
              >
                <Image className="h-5 w-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </button>
              <button 
                onClick={() => videoInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-[#1C563D] rounded-full hover:bg-gray-100 transition-colors"
                title="Add video"
              >
                <Video className="h-5 w-5" />
                <input
                  type="file"
                  ref={videoInputRef}
                  className="hidden"
                  accept="video/*"
                  onChange={handleVideoUpload}
                />
              </button>
              <button 
                onClick={() => !linkPreview && setShowLinkInput(true)}
                className="p-2 text-gray-500 hover:text-[#1C563D] rounded-full hover:bg-gray-100 transition-colors"
                title="Add link"
                disabled={!!linkPreview}
              >
                <Link className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isUploading || isLoadingPreview}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                content.trim() && !isUploading && !isLoadingPreview
                  ? 'bg-[#1C563D] hover:bg-[#164430] text-white'
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
            >
              <Send className="h-4 w-4" />
              <span>Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}