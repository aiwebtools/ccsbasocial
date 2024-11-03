import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { sendPasswordResetEmail } from '../../services/emailService';

interface ForgotPasswordProps {
  onBack: () => void;
  onResetSent: () => void;
}

export default function ForgotPassword({ onBack, onResetSent }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const resetToken = Math.random().toString(36).substring(2, 15);
      await sendPasswordResetEmail(email, resetToken);
      setSuccess(true);
      setTimeout(onResetSent, 3000);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">Reset Password</h2>

        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md">
            Password reset instructions have been sent to your email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1C563D] focus:border-[#1C563D] sm:text-sm"
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1C563D] hover:bg-[#164430] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C563D]"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}