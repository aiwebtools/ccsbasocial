import React from 'react';
import { User, Image as ImageIcon } from 'lucide-react';

interface ProfileAvatarProps {
  avatar?: string;
  isEditing: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileAvatar({ avatar, isEditing, onImageUpload }: ProfileAvatarProps) {
  return (
    <div className="relative h-24 w-24">
      {avatar ? (
        <img
          src={avatar}
          alt="Profile"
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className="h-24 w-24 rounded-full bg-[#A3C3A3] flex items-center justify-center">
          <User className="h-12 w-12 text-[#1C563D]" />
        </div>
      )}
      {isEditing && (
        <label className="absolute bottom-0 right-0 bg-[#1C563D] rounded-full p-2 cursor-pointer">
          <ImageIcon className="h-4 w-4 text-white" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onImageUpload}
          />
        </label>
      )}
    </div>
  );
}