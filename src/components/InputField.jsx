import React, { useState } from 'react';

const InputField = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  icon,
  showEye = false,
  onToggleEye,
  ...props
}) => {
  const [inputType, setInputType] = useState(type);

  const handleToggleEye = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
    if (onToggleEye) onToggleEye();
  };

  return (
    <div className="relative mb-4">
      {icon && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">{icon}</span>
      )}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full py-3 px-4 pl-${icon ? '10' : '4'} pr-${showEye ? '10' : '4'} rounded-lg border border-gray-300 focus:border-[#2e86de] focus:ring-2 focus:ring-[#2e86de] outline-none bg-white shadow-sm text-base`}
        {...props}
      />
      {showEye && (
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg focus:outline-none"
          onClick={handleToggleEye}
          tabIndex={-1}
        >
          {inputType === 'password' ? '👁️' : '🙈'}
        </button>
      )}
    </div>
  );
};

export default InputField; 