import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  pattern?: (value: string) => string;
}

export default function ProfileField({
  id,
  label,
  value,
  onChange,
  disabled,
  type = 'text',
  placeholder,
  icon: Icon,
  pattern
}: ProfileFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = pattern ? pattern(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type={type}
          id={id}
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 rounded-md ${
            disabled 
              ? 'bg-gray-50 text-gray-500 border-gray-300' 
              : 'border-gray-300 focus:ring-[#1C563D] focus:border-[#1C563D]'
          }`}
        />
        {Icon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}