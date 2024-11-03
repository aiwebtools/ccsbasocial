import React, { useState, useEffect } from 'react';
import { MessageSquare, Building2, Phone, Globe, ArrowLeft, User } from 'lucide-react';
import Post from '../feed/Post';

interface UserProfile {
  email: string;
  name: string;
  businessName: string;
  phoneNumber: string;
  website: string;
  avatar?: string;
  banner?: string;
}

interface UserPost {
  id: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  thumbsUp: number;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
}

interface UserProfileViewProps {
  userEmail: string;
  onBack: () => void;
  onMessage: (email: string) => void;
}

export default function UserProfileView({ userEmail, onBack, onMessage }: UserProfileViewProps) {
  const [profile, setProfile] = useState<UserProfile>({
    email: userEmail,
    name: userEmail,
    businessName: '',
    phoneNumber: '',
    website: '',
    avatar: undefined,
    banner: undefined
  });
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    // Load user profile
    const savedProfile = localStorage.getItem(`profile_${userEmail}`);
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile({
        email: userEmail,
        name: parsedProfile.name || userEmail,
        businessName: parsedProfile.businessName || '',
        phoneNumber: parsedProfile.phoneNumber || '',
        website: parsedProfile.website || '',
        avatar: parsedProfile.avatar,
        banner: parsedProfile.banner
      });
    }

    // Load user posts
    const allPosts = JSON.parse(localStorage.getItem('ccsba_all_posts') || '[]');
    const userPosts = allPosts.filter((post: UserPost) => post.author.email === userEmail);
    setPosts(userPosts);
    setIsLoading(false);
  }, [userEmail]);

  const handleLike = (postId: string, authorEmail: string) => {
    if (currentUserEmail === authorEmail) return;

    const allPosts = JSON.parse(localStorage.getItem('ccsba_all_posts') || '[]');
    const updatedPosts = allPosts.map((post: UserPost) => {
      if (post.id === postId) {
        const newPost = { ...post, likes: (post.likes || 0) + 1 };
        
        // Create notification
        const notifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
        const currentUserProfile = JSON.parse(localStorage.getItem(`profile_${currentUserEmail}`) || '{}');
        notifications.unshift({
          id: Date.now().toString(),
          text: 'liked your post',
          timestamp: new Date().toISOString(),
          read: false,
          type: 'like',
          recipient: authorEmail,
          actorName: currentUserProfile.businessName || currentUserProfile.name || currentUserEmail,
          postContent: post.content
        });
        localStorage.setItem('ccsba_notification_details', JSON.stringify(notifications));
        
        return newPost;
      }
      return post;
    });
    
    localStorage.setItem('ccsba_all_posts', JSON.stringify(updatedPosts));
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
    ));
  };

  const handleThumbsUp = (postId: string, authorEmail: string) => {
    if (currentUserEmail === authorEmail) return;

    const allPosts = JSON.parse(localStorage.getItem('ccsba_all_posts') || '[]');
    const updatedPosts = allPosts.map((post: UserPost) => {
      if (post.id === postId) {
        const newPost = { ...post, thumbsUp: (post.thumbsUp || 0) + 1 };
        
        // Create notification
        const notifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
        const currentUserProfile = JSON.parse(localStorage.getItem(`profile_${currentUserEmail}`) || '{}');
        notifications.unshift({
          id: Date.now().toString(),
          text: 'gave a thumbs up to your post',
          timestamp: new Date().toISOString(),
          read: false,
          type: 'thumbsUp',
          recipient: authorEmail,
          actorName: currentUserProfile.businessName || currentUserProfile.name || currentUserEmail,
          postContent: post.content
        });
        localStorage.setItem('ccsba_notification_details', JSON.stringify(notifications));
        
        return newPost;
      }
      return post;
    });
    
    localStorage.setItem('ccsba_all_posts', JSON.stringify(updatedPosts));
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, thumbsUp: (post.thumbsUp || 0) + 1 } : post
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C563D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const formatWebsiteUrl = (url: string) => {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to directory
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Banner Image */}
        <div className="h-48 relative">
          {profile.banner ? (
            <img
              src={profile.banner}
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full bg-gradient-to-r from-[#1C563D] to-[#A3C3A3]" />
          )}
        </div>

        <div className="relative px-6 pb-6">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-6">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-[#A3C3A3]">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <User className="h-16 w-16 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="ml-44 pt-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.businessName || profile.name}
                </h2>
                <p className="text-gray-500">{profile.email}</p>
              </div>
              <button
                onClick={() => onMessage(userEmail)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1C563D] hover:bg-[#164430]"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Message
              </button>
            </div>

            {/* Business Details */}
            <div className="mt-6 grid grid-cols-1 gap-4">
              {profile.businessName && (
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>{profile.businessName}</span>
                </div>
              )}
              {profile.phoneNumber && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>{profile.phoneNumber}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center text-gray-600">
                  <Globe className="h-5 w-5 mr-2" />
                  <a 
                    href={formatWebsiteUrl(profile.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1C563D] hover:underline"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Posts</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              author={{
                name: profile.businessName || profile.name || profile.email,
                email: profile.email,
                avatar: profile.avatar
              }}
              content={post.content}
              image={post.image}
              timestamp={post.timestamp}
              likes={post.likes}
              thumbsUp={post.thumbsUp}
              onLike={handleLike}
              onThumbsUp={handleThumbsUp}
              onInteraction={() => {}}
            />
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}