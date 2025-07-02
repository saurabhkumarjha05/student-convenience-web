import React, { useState } from 'react';
import InputField from './InputField';

const AuthForm = ({
  type = 'login',
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  buttonText,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md" onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold text-[#2e86de] mb-6 text-center">{type === 'login' ? 'Login' : 'Sign Up'}</h2>
      <InputField
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<span>📧</span>}
        required
      />
      <InputField
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<span>🔒</span>}
        showEye
        onToggleEye={() => setShowPassword((prev) => !prev)}
        required
      />
      <div className="flex justify-end mb-4">
        <button type="button" className="text-[#2e86de] text-sm hover:underline" tabIndex={-1}>
          Forgot Password?
        </button>
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-[#2e86de] text-white font-bold rounded-full shadow hover:bg-[#00c897] transition mb-4 text-lg"
      >
        {buttonText}
      </button>
      <div className="flex flex-col gap-2">
        <button type="button" className="w-full py-2 bg-[#ffb703] text-white font-semibold rounded-full shadow hover:bg-[#ffa502] transition">
          Login with OTP
        </button>
        <button type="button" className="w-full py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full shadow hover:bg-gray-100 transition flex items-center justify-center gap-2">
          <span>🔵</span> Sign in with Google
        </button>
      </div>
    </form>
  );
};

export default AuthForm; 