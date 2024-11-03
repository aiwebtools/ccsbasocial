import React, { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../../lib/auth';

interface ResetPasswordProps {
  token: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function ResetPassword({ token, onBack, onSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(token, password);
      onSuccess();
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="flex items-center text-sm text-[#1C563D] hover:text-[#164430]"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </button>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please enter your new password below.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1C563D] focus:border-[#1C563D] sm:text-sm"
            />
            <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="mt-1 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1C563D] focus:border-[#1C563D] sm:text-sm"
            />
            <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1C563D] hover:bg-[#164430] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C563D]"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}