import React, { useState, useEffect } from 'react';
import { Building2, Phone, Globe, Camera } from 'lucide-react';
import CreatePost from '../feed/CreatePost';
import Post from '../feed/Post';
import ProfileHeader from './ProfileHeader';
import ProfileAvatar from './ProfileAvatar';
import ProfileField from './ProfileField';
import ProfileBanner from './ProfileBanner';

interface ProfileData {
  name: string;
  email: string;
  businessName: string;
  phoneNumber: string;
  website: string;
  avatar?: string;
  banner?: string;
}

interface ProfilePost {
  id: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  thumbsUp: number;
}

const defaultProfile: ProfileData = {
  name: '',
  email: localStorage.getItem('userEmail') || '',
  businessName: '',
  phoneNumber: '999-999-9999',
  website: '',
  avatar: undefined,
  banner: undefined
};

export default function ProfileArea() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [editedProfile, setEditedProfile] = useState<ProfileData>(defaultProfile);
  const [userPosts, setUserPosts] = useState<ProfilePost[]>([]);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const savedProfile = localStorage.getItem(`profile_${userEmail}`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setEditedProfile(parsedProfile);
      } else {
        const initialProfile = { ...defaultProfile, email: userEmail };
        setProfile(initialProfile);
        setEditedProfile(initialProfile);
      }

      // Load user's posts
      const allPosts = JSON.parse(localStorage.getItem('ccsba_all_posts') || '[]');
      const userPosts = allPosts.filter((post: any) => post.author.email === userEmail);
      setUserPosts(userPosts);
    }
  }, []);

  const handleSave = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      // Save profile
      setProfile(editedProfile);
      localStorage.setItem(`profile_${userEmail}`, JSON.stringify(editedProfile));

      // Update posts with new profile info
      const allPosts = JSON.parse(localStorage.getItem('ccsba_all_posts') || '[]');
      const updatedPosts = allPosts.map((post: any) => {
        if (post.author.email === userEmail) {
          return {
            ...post,
            author: {
              ...post.author,
              name: editedProfile.businessName || editedProfile.name || userEmail,
              avatar: editedProfile.avatar
            }
          };
        }
        return post;
      });
      localStorage.setItem('ccsba_all_posts', JSON.stringify(updatedPosts));

      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({
          ...prev,
          [type]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewPost = (content: string, image?: string) => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const newPost = {
        id: Date.now().toString(),
        author: {
          name: profile.businessName || profile.name || userEmail,
          email: userEmail,
          avatar: profile.avatar
        },
        content,
        image,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        thumbsUp: 0,
        comments: []
      };

      // Update local posts
      const allPosts = JSON.parse(localStorage.getItem('ccsba_all_posts') || '[]');
      const updatedPosts = [newPost, ...allPosts];
      localStorage.setItem('ccsba_all_posts', JSON.stringify(updatedPosts));

      // Update user's posts
      setUserPosts(prev => [newPost, ...prev]);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return value;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg mb-6">
        <ProfileBanner
          banner={isEditing ? editedProfile.banner : profile.banner}
          isEditing={isEditing}
          onBannerUpload={(e) => handleImageUpload(e, 'banner')}
        />
        
        <div className="px-4 py-5 sm:p-6">
          <ProfileHeader
            isEditing={isEditing}
            saveMessage={saveMessage}
            onEditToggle={() => setIsEditing(true)}
            onSave={handleSave}
          />

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <ProfileAvatar
                avatar={isEditing ? editedProfile.avatar : profile.avatar}
                isEditing={isEditing}
                onImageUpload={(e) => handleImageUpload(e, 'avatar')}
              />
              <div className="flex-1 space-y-4">
                <ProfileField
                  id="name"
                  label="Name"
                  value={isEditing ? editedProfile.name : profile.name}
                  onChange={(value) => setEditedProfile(prev => ({ ...prev, name: value }))}
                  disabled={!isEditing}
                />
                <ProfileField
                  id="businessName"
                  label="Business Name"
                  value={isEditing ? editedProfile.businessName : profile.businessName}
                  onChange={(value) => setEditedProfile(prev => ({ ...prev, businessName: value }))}
                  disabled={!isEditing}
                  icon={Building2}
                />
                <ProfileField
                  id="website"
                  label="Business Website"
                  value={isEditing ? editedProfile.website : profile.website}
                  onChange={(value) => setEditedProfile(prev => ({ ...prev, website: value }))}
                  disabled={!isEditing}
                  type="url"
                  placeholder="https://www.example.com"
                  icon={Globe}
                />
                <ProfileField
                  id="phoneNumber"
                  label="Business Phone"
                  value={isEditing ? editedProfile.phoneNumber : profile.phoneNumber}
                  onChange={(value) => setEditedProfile(prev => ({ ...prev, phoneNumber: formatPhoneNumber(value) }))}
                  disabled={!isEditing}
                  type="tel"
                  placeholder="999-999-9999"
                  icon={Phone}
                  pattern={formatPhoneNumber}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <CreatePost onPost={handleNewPost} />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">My Posts</h3>
        {userPosts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            author={{
              name: profile.businessName || profile.name || profile.email,
              email: profile.email,
              avatar: profile.avatar
            }}
            content={post.content}
            timestamp={post.timestamp}
            likes={post.likes}
            thumbsUp={post.thumbsUp}
            image={post.image}
            onLike={() => {}}
            onThumbsUp={() => {}}
            onInteraction={() => {}}
          />
        ))}
      </div>
    </div>
  );
}