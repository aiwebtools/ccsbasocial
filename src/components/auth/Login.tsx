import React, { useState } from 'react';
import LoginForm from './LoginForm';
import ForgotPassword from './ForgotPassword';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function Login({ onLogin }: LoginProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 text-[#1C563D]">🌱</div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#1C563D]">CCSBA</h1>
          <h2 className="mt-2 text-sm text-gray-600">
            Connecticut Cannabis Small Business Alliance
          </h2>
          <p className="mt-2 text-sm font-medium text-[#1C563D]">
            EMPOWER • EDUCATE • ACHIEVE
          </p>
        </div>
        {showForgotPassword ? (
          <ForgotPassword
            onBack={() => setShowForgotPassword(false)}
            onResetSent={() => {
              setShowForgotPassword(false);
            }}
          />
        ) : (
          <LoginForm 
            onLogin={onLogin}
            onForgotPassword={() => setShowForgotPassword(true)}
          />
        )}
      </div>
    </div>
  );
}