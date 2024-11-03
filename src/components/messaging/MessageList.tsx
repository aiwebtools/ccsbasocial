import React, { useState, useEffect, useRef } from 'react';
import { User, ArrowLeft, Send } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface MessageListProps {
  onClose: () => void;
}

export default function MessageList({ onClose }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const currentUserEmail = localStorage.getItem('userEmail');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedMessage]);

  const loadMessages = () => {
    const allMessages = JSON.parse(localStorage.getItem('ccsba_messages') || '[]');
    const userMessages = allMessages.filter((msg: Message) =>
      msg.sender === currentUserEmail || msg.recipient === currentUserEmail
    );

    // Mark messages as read when they're viewed
    const updatedMessages = allMessages.map((msg: Message) => {
      if (msg.recipient === currentUserEmail) {
        return { ...msg, read: true };
      }
      return msg;
    });
    localStorage.setItem('ccsba_messages', JSON.stringify(updatedMessages));

    setMessages(userMessages);
  };

  const getConversation = (message: Message) => {
    const otherUser = message.sender === currentUserEmail ? message.recipient : message.sender;
    return messages.filter(msg =>
      (msg.sender === currentUserEmail && msg.recipient === otherUser) ||
      (msg.sender === otherUser && msg.recipient === currentUserEmail)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getSenderProfile = (email: string) => {
    const profile = JSON.parse(localStorage.getItem(`profile_${email}`) || '{}');
    return {
      name: profile.businessName || profile.name || email,
      avatar: profile.avatar
    };
  };

  const getUnreadCount = (userEmail: string) => {
    return messages.filter(msg => 
      msg.sender === userEmail && 
      msg.recipient === currentUserEmail && 
      !msg.read
    ).length;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyContent.trim()) return;

    const recipient = selectedMessage.sender === currentUserEmail 
      ? selectedMessage.recipient 
      : selectedMessage.sender;

    const newMessage = {
      id: Date.now().toString(),
      sender: currentUserEmail,
      recipient,
      content: replyContent,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedMessages = [...messages, newMessage];
    localStorage.setItem('ccsba_messages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
    setReplyContent('');

    // Focus back on input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="p-4">
        {selectedMessage ? (
          <div className="h-[24rem] flex flex-col">
            <button
              onClick={() => setSelectedMessage(null)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to messages
            </button>

            <div className="flex items-center space-x-3 pb-2 border-b">
              {getSenderProfile(selectedMessage.sender === currentUserEmail ? selectedMessage.recipient : selectedMessage.sender).avatar ? (
                <img
                  src={getSenderProfile(selectedMessage.sender === currentUserEmail ? selectedMessage.recipient : selectedMessage.sender).avatar}
                  alt="Contact"
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-[#A3C3A3] flex items-center justify-center">
                  <User className="h-5 w-5 text-[#1C563D]" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {getSenderProfile(selectedMessage.sender === currentUserEmail ? selectedMessage.recipient : selectedMessage.sender).name}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-2">
              {getConversation(selectedMessage).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === currentUserEmail ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-1.5 ${
                      msg.sender === currentUserEmail
                        ? 'bg-[#1C563D] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-0.5 opacity-75">
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t pt-2 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-1.5 border border-gray-300 rounded-md focus:ring-[#1C563D] focus:border-[#1C563D] text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyContent.trim()}
                  className="p-1.5 text-white bg-[#1C563D] rounded-md hover:bg-[#164430] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Messages</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {messages.length > 0 ? (
                Array.from(new Set(messages.map(m => 
                  m.sender === currentUserEmail ? m.recipient : m.sender
                ))).map(userEmail => {
                  const lastMessage = messages.find(m => 
                    m.sender === userEmail || m.recipient === userEmail
                  );
                  if (!lastMessage) return null;
                  
                  const unreadCount = getUnreadCount(userEmail);
                  
                  return (
                    <div
                      key={userEmail}
                      onClick={() => setSelectedMessage(lastMessage)}
                      className={`flex items-start space-x-3 p-2 rounded-lg cursor-pointer ${
                        unreadCount > 0 ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {getSenderProfile(userEmail).avatar ? (
                        <img
                          src={getSenderProfile(userEmail).avatar}
                          alt="Contact"
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-[#A3C3A3] flex items-center justify-center">
                          <User className="h-5 w-5 text-[#1C563D]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-900 text-sm">
                            {getSenderProfile(userEmail).name}
                          </p>
                          {unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(lastMessage.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-4">No messages yet</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}