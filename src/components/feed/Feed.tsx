import React, { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import Post from './Post';

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface Comment {
  id: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
}

interface PostType {
  id: string;
  author: {
    name: string;
    email: string;
    avatar: string;
  };
  content: string;
  image?: string;
  video?: string;
  link?: string;
  linkPreview?: LinkPreview;
  timestamp: string;
  likes: number;
  thumbsUp: number;
  comments: Comment[];
}

export default function Feed({ onInteraction }: { onInteraction: () => void }) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const currentUserEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    // Check if user is admin
    const email = localStorage.getItem('userEmail');
    if (email) {
      const credentials = JSON.parse(localStorage.getItem('userCredentials') || '[]');
      const user = credentials.find((cred: any) => cred.email === email);
      setIsAdmin(email === 'info@ctcannabisalliance.org' || email === 'mike@sweetheal.com' || (user && user.isAdmin));
    }

    // Load all posts from localStorage
    const savedPosts = localStorage.getItem('ccsba_all_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with welcome post if no posts exist
      const initialPost = {
        id: '1',
        author: {
          name: 'CCSBA Admin',
          email: 'info@ctcannabisalliance.org',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: 'Welcome to the CCSBA platform! Stay connected with the Connecticut cannabis community.',
        timestamp: new Date().toLocaleString(),
        likes: 0,
        thumbsUp: 0,
        comments: []
      };
      setPosts([initialPost]);
      localStorage.setItem('ccsba_all_posts', JSON.stringify([initialPost]));
    }
  }, []);

  const getUserProfile = () => {
    const userEmail = localStorage.getItem('userEmail');
    const savedProfile = localStorage.getItem(`profile_${userEmail}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      return {
        name: profile.businessName || profile.name || userEmail,
        email: userEmail,
        avatar: profile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      };
    }
    return {
      name: userEmail,
      email: userEmail,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    };
  };

  const handleNewPost = (content: string, image?: string, video?: string, link?: string, linkPreview?: LinkPreview) => {
    const userProfile = getUserProfile();
    const newPost = {
      id: Date.now().toString(),
      author: userProfile,
      content,
      image,
      video,
      link,
      linkPreview,
      timestamp: new Date().toISOString(),
      likes: 0,
      thumbsUp: 0,
      comments: []
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('ccsba_all_posts', JSON.stringify(updatedPosts));
  };

  const handleComment = (postId: string, content: string) => {
    const userProfile = getUserProfile();
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: userProfile.name,
        email: userProfile.email,
        avatar: userProfile.avatar
      },
      content,
      timestamp: new Date().toISOString()
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        // Create notification for post author
        if (post.author.email !== currentUserEmail) {
          const notifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
          notifications.unshift({
            id: Date.now().toString(),
            text: 'commented on your post',
            timestamp: new Date().toISOString(),
            read: false,
            type: 'comment',
            recipient: post.author.email,
            actorName: userProfile.name,
            postContent: post.content
          });
          localStorage.setItem('ccsba_notification_details', JSON.stringify(notifications));
          onInteraction();
        }

        return {
          ...post,
          comments: [...(post.comments || []), newComment]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('ccsba_all_posts', JSON.stringify(updatedPosts));
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('ccsba_all_posts', JSON.stringify(updatedPosts));
  };

  const handleWarnUser = (postId: string, authorEmail: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const notifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
    const newNotification = {
      id: Date.now().toString(),
      type: 'warning',
      text: 'Your post has been flagged as potentially inappropriate by an admin',
      timestamp: new Date().toLocaleString(),
      read: false,
      recipient: authorEmail,
      actorName: 'CCSBA Admin',
      postContent: post.content,
      postId
    };

    notifications.unshift(newNotification);
    localStorage.setItem('ccsba_notification_details', JSON.stringify(notifications));

    if (authorEmail === currentUserEmail) {
      onInteraction();
    }
  };

  const handleLike = (id: string, authorEmail: string) => {
    if (currentUserEmail === authorEmail) return;

    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        // Create notification
        const notifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
        const userProfile = getUserProfile();
        notifications.unshift({
          id: Date.now().toString(),
          text: 'liked your post',
          timestamp: new Date().toISOString(),
          read: false,
          type: 'like',
          recipient: authorEmail,
          actorName: userProfile.name,
          postContent: post.content
        });
        localStorage.setItem('ccsba_notification_details', JSON.stringify(notifications));
        onInteraction();
        
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('ccsba_all_posts', JSON.stringify(updatedPosts));
  };

  const handleThumbsUp = (id: string, authorEmail: string) => {
    if (currentUserEmail === authorEmail) return;

    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        // Create notification
        const notifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
        const userProfile = getUserProfile();
        notifications.unshift({
          id: Date.now().toString(),
          text: 'gave a thumbs up to your post',
          timestamp: new Date().toISOString(),
          read: false,
          type: 'thumbsUp',
          recipient: authorEmail,
          actorName: userProfile.name,
          postContent: post.content
        });
        localStorage.setItem('ccsba_notification_details', JSON.stringify(notifications));
        onInteraction();
        
        return { ...post, thumbsUp: post.thumbsUp + 1 };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('ccsba_all_posts', JSON.stringify(updatedPosts));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <CreatePost onPost={handleNewPost} />
      {posts.map(post => (
        <Post
          key={post.id}
          {...post}
          onLike={handleLike}
          onThumbsUp={handleThumbsUp}
          onComment={handleComment}
          onInteraction={onInteraction}
          onDelete={handleDeletePost}
          onWarn={handleWarnUser}
          isAdmin={isAdmin || post.author.email === currentUserEmail}
        />
      ))}
    </div>
  );
}