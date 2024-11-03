import React from 'react';
import { Home, Wrench, Calendar, Users, BookOpen, Hash } from 'lucide-react';

interface SidebarProps {
  isAdmin: boolean;
  currentView: 'feed' | 'users' | 'profile';
  onViewChange: (view: 'feed' | 'users' | 'profile') => void;
}

const navigation = [
  { name: 'Home', icon: Home, view: 'feed' as const },
  { name: 'AI Tools', icon: Wrench },
  { name: 'Events', icon: Calendar },
  { name: 'Groups', icon: Users },
  { name: 'Resources', icon: BookOpen },
];

const trendingTopics = [
  'Connecticut Cannabis Law',
  'Business Growth',
  'Cultivation Tips',
  'Industry News',
];

export default function Sidebar({ isAdmin, currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="hidden lg:block lg:fixed lg:inset-y-0 lg:w-64 lg:pt-16">
      <div className="h-full bg-white border-r border-gray-200">
        <div className="flex flex-col h-full pt-5 pb-4">
          <nav className="mt-5 flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => item.view && onViewChange(item.view)}
                className={`w-full group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentView === item.view
                    ? 'bg-[#A3C3A3] text-[#1C563D]'
                    : 'text-gray-600 hover:bg-[#A3C3A3] hover:text-[#1C563D]'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
            
            {isAdmin && (
              <button
                onClick={() => onViewChange('users')}
                className={`w-full group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentView === 'users'
                    ? 'bg-[#A3C3A3] text-[#1C563D]'
                    : 'text-gray-600 hover:bg-[#A3C3A3] hover:text-[#1C563D]'
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                User Management
              </button>
            )}
          </nav>
          
          <div className="mt-6 px-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Trending Topics
            </h3>
            <div className="mt-2 space-y-1">
              {trendingTopics.map((topic) => (
                <a
                  key={topic}
                  href="#"
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-[#1C563D] hover:bg-[#A3C3A3]"
                >
                  <Hash className="mr-3 h-4 w-4" />
                  {topic}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}