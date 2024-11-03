import React, { useState, useEffect } from 'react';
import { MessageSquare, User } from 'lucide-react';
import UserProfileView from '../profile/UserProfileView';

interface Member {
  email: string;
  name: string;
  businessName: string;
  avatar?: string;
  isAdmin?: boolean;
}

export default function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [message, setMessage] = useState('');
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const currentUserEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    // Load all user profiles
    const credentials = JSON.parse(localStorage.getItem('userCredentials') || '[]');
    const profiles = credentials.map((cred: any) => {
      const profile = JSON.parse(localStorage.getItem(`profile_${cred.email}`) || '{}');
      return {
        email: cred.email,
        name: profile.name || cred.email,
        businessName: profile.businessName || '',
        avatar: profile.avatar
      };
    });

    // Add Mike's profile if not already in credentials
    const mikeExists = profiles.some(p => p.email === 'mike@sweetheal.com');
    if (!mikeExists) {
      const mikeProfile = JSON.parse(localStorage.getItem('profile_mike@sweetheal.com') || '{}');
      profiles.push({
        email: 'mike@sweetheal.com',
        name: mikeProfile.name || 'Mike',
        businessName: mikeProfile.businessName || '',
        avatar: mikeProfile.avatar
      });
    }

    // Add admin user if not current user
    if (currentUserEmail !== 'info@ctcannabisalliance.org') {
      profiles.push({
        email: 'info@ctcannabisalliance.org',
        name: 'CCSBA Admin',
        businessName: 'Connecticut Cannabis Small Business Alliance',
        isAdmin: true,
        avatar: undefined
      });
    }

    // Filter out current user and sort by name
    const filteredProfiles = profiles
      .filter(m => m.email !== currentUserEmail)
      .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));

    setMembers(filteredProfiles);
  }, []);

  const sendMessage = () => {
    if (!selectedMember || !message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: currentUserEmail,
      recipient: selectedMember.email,
      content: message,
      timestamp: new Date().toISOString(),
      read: false
    };

    const messages = JSON.parse(localStorage.getItem('ccsba_messages') || '[]');
    messages.push(newMessage);
    localStorage.setItem('ccsba_messages', JSON.stringify(messages));

    // Create notification for new message
    const notifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
    const userProfile = JSON.parse(localStorage.getItem(`profile_${currentUserEmail}`) || '{}');
    notifications.unshift({
      id: Date.now().toString(),
      text: 'sent you a message',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'message',
      recipient: selectedMember.email,
      actorName: userProfile.businessName || userProfile.name || currentUserEmail
    });
    localStorage.setItem('ccsba_notification_details', JSON.stringify(notifications));

    setMessage('');
    setSelectedMember(null);
  };

  if (viewingProfile) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <UserProfileView
          userEmail={viewingProfile}
          onBack={() => setViewingProfile(null)}
          onMessage={(email) => {
            setViewingProfile(null);
            setSelectedMember(members.find(m => m.email === email) || null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Member Directory</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.email}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => setViewingProfile(member.email)}
            >
              <div className="flex items-center space-x-3">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#A3C3A3] flex items-center justify-center">
                    <User className="h-6 w-6 text-[#1C563D]" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {member.businessName || member.name}
                    {member.isAdmin && (
                      <span className="ml-2 text-xs bg-[#1C563D] text-white px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMember(member);
                }}
                className="p-2 text-[#1C563D] hover:bg-[#A3C3A3] rounded-full"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {selectedMember && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="mb-2">
              <span className="text-sm text-gray-500">Message to:</span>
              <span className="ml-2 font-medium">
                {selectedMember.businessName || selectedMember.name}
                {selectedMember.isAdmin && (
                  <span className="ml-2 text-xs bg-[#1C563D] text-white px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1C563D] focus:border-[#1C563D]"
              rows={3}
              placeholder="Type your message..."
            />
            <div className="mt-2 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="px-3 py-1 text-sm text-white bg-[#1C563D] rounded hover:bg-[#164430] disabled:opacity-50"
              >
                Send Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}