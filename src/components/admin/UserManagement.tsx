import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Shield, Trash2, Edit2, X, Check } from 'lucide-react';

interface User {
  email: string;
  dateAdded: string;
  status: 'active';
  isAdmin?: boolean;
}

export default function UserManagement() {
  const [newEmail, setNewEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editedEmail, setEditedEmail] = useState('');

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('userCredentials') || '[]');
    setUsers(savedUsers.map((user: any) => ({
      email: user.email,
      dateAdded: user.dateAdded || new Date().toISOString(),
      status: 'active',
      isAdmin: user.isAdmin
    })));
  }, []);

  const validateAndAddUser = (e: React.FormEvent, isAdmin: boolean = false) => {
    e.preventDefault();
    
    if (!newEmail.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter an email address'
      });
      return;
    }

    try {
      const newUser = {
        email: newEmail,
        password: isAdmin ? 'THC' : 'CBD', // Board members use THC, regular members use CBD
        dateAdded: new Date().toISOString(),
        isAdmin // This flag grants admin privileges
      };

      const existingCredentials = JSON.parse(localStorage.getItem('userCredentials') || '[]');
      
      if (existingCredentials.some((user: any) => user.email === newEmail)) {
        setMessage({
          type: 'error',
          text: 'User with this email already exists'
        });
        return;
      }

      localStorage.setItem('userCredentials', JSON.stringify([...existingCredentials, newUser]));
      
      setUsers(prev => [...prev, {
        email: newEmail,
        dateAdded: new Date().toISOString(),
        status: 'active',
        isAdmin
      }]);

      // Send welcome email with credentials
      const notifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        text: isAdmin ? 'You have been added as a board member' : 'Your account has been created',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'system',
        recipient: newEmail,
        actorName: 'CCSBA Admin',
        credentials: {
          email: newEmail,
          password: isAdmin ? 'THC' : 'CBD'
        }
      });
      localStorage.setItem('ccsba_notification_details', JSON.stringify(notifications));

      setMessage({
        type: 'success',
        text: `${isAdmin ? 'Board member' : 'User'} ${newEmail} added successfully. They can login with password: ${isAdmin ? 'THC' : 'CBD'}`
      });
      setNewEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add user. Please try again.'
      });
    }
  };

  const handleDelete = (email: string) => {
    if (window.confirm(`Are you sure you want to delete ${email} from the list?`)) {
      const existingCredentials = JSON.parse(localStorage.getItem('userCredentials') || '[]');
      const updatedCredentials = existingCredentials.filter((user: any) => user.email !== email);
      localStorage.setItem('userCredentials', JSON.stringify(updatedCredentials));
      
      setUsers(prev => prev.filter(user => user.email !== email));
      setMessage({
        type: 'success',
        text: 'User deleted successfully'
      });
    }
  };

  const startEditing = (email: string) => {
    setEditingUser(email);
    setEditedEmail(email);
  };

  const handleEdit = (oldEmail: string) => {
    if (!editedEmail.trim()) {
      setMessage({
        type: 'error',
        text: 'Email cannot be empty'
      });
      return;
    }

    const existingCredentials = JSON.parse(localStorage.getItem('userCredentials') || '[]');
    if (editedEmail !== oldEmail && existingCredentials.some((user: any) => user.email === editedEmail)) {
      setMessage({
        type: 'error',
        text: 'Email already exists'
      });
      return;
    }

    const updatedCredentials = existingCredentials.map((user: any) =>
      user.email === oldEmail ? { ...user, email: editedEmail } : user
    );
    localStorage.setItem('userCredentials', JSON.stringify(updatedCredentials));

    setUsers(prev => prev.map(user =>
      user.email === oldEmail ? { ...user, email: editedEmail } : user
    ));

    setEditingUser(null);
    setMessage({
      type: 'success',
      text: 'User email updated successfully'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Management
          </h3>
          
          <form onSubmit={(e) => validateAndAddUser(e)} className="mt-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      setMessage({ type: '', text: '' });
                    }}
                    className={`shadow-sm focus:ring-[#1C563D] focus:border-[#1C563D] block w-full sm:text-sm border-gray-300 rounded-md ${
                      message.type === 'error' ? 'border-red-300' : ''
                    }`}
                    placeholder="Enter email address"
                  />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1C563D] hover:bg-[#164430] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C563D]"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add User
                </button>
                <button
                  type="button"
                  onClick={(e) => validateAndAddUser(e, true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1C563D] hover:bg-[#164430] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C563D]"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Add Board Member
                </button>
              </div>
            </div>
          </form>

          {message.text && (
            <div className={`mt-4 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="mt-8">
            <h4 className="text-base font-medium text-gray-900">Users</h4>
            <div className="mt-4 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Email
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Date Added
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Role
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {users.map((user) => (
                          <tr key={user.email}>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {editingUser === user.email ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="email"
                                    value={editedEmail}
                                    onChange={(e) => setEditedEmail(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1C563D] focus:ring-[#1C563D] sm:text-sm"
                                  />
                                  <button
                                    onClick={() => handleEdit(user.email)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingUser(null)}
                                    className="text-gray-600 hover:text-gray-700"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </div>
                              ) : (
                                user.email
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(user.dateAdded).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              {user.isAdmin ? (
                                <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-purple-100 text-purple-800">
                                  Board Member
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-blue-100 text-blue-800">
                                  Member
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-green-100 text-green-800">
                                {user.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => startEditing(user.email)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Edit2 className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user.email)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}