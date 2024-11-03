import React from 'react';
import { Save } from 'lucide-react';

interface ProfileHeaderProps {
  isEditing: boolean;
  saveMessage: string;
  onEditToggle: () => void;
  onSave: () => void;
}

export default function ProfileHeader({ isEditing, saveMessage, onEditToggle, onSave }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">My Profile</h3>
      <div className="flex items-center space-x-4">
        {saveMessage && (
          <span className="text-green-600 text-sm">{saveMessage}</span>
        )}
        <button
          onClick={() => isEditing ? onSave() : onEditToggle()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1C563D] hover:bg-[#164430]"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            'Edit Profile'
          )}
        </button>
      </div>
    </div>
  );
}