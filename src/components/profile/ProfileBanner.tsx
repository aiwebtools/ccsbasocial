import React from 'react';
import { Camera } from 'lucide-react';

interface ProfileBannerProps {
  banner?: string;
  isEditing: boolean;
  onBannerUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileBanner({ banner, isEditing, onBannerUpload }: ProfileBannerProps) {
  return (
    <div className="relative h-48 rounded-t-lg overflow-hidden">
      {banner ? (
        <img
          src={banner}
          alt="Profile Banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-[#1C563D] to-[#A3C3A3]" />
      )}
      
      {isEditing && (
        <label className="absolute bottom-4 right-4 bg-[#1C563D] text-white rounded-lg px-4 py-2 cursor-pointer flex items-center space-x-2 hover:bg-[#164430] transition-colors">
          <Camera className="h-5 w-5" />
          <span>Change Banner</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onBannerUpload}
          />
        </label>
      )}
    </div>
  );
}