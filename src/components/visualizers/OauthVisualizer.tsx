"use client";
import { useState, useEffect } from 'react';

export function OauthVisualizer() {
  const [step, setStep] = useState(0);
  const [tokens, setTokens] = useState({ authCode: '', accessToken: '', refreshToken: '' });
  const [isAnimating, setIsAnimating] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', avatar: '' });

  const steps = [
    { title: "User clicks 'Sign in with Google'", description: "User initiates OAuth flow" },
    { title: "Redirect to Authorization Server", description: "App redirects user to Google's auth server" },
    { title: "User Grants Permission", description: "User logs in and approves access" },
    { title: "Authorization Code Returned", description: "Google redirects back with auth code" },
    { title: "Exchange Code for Token", description: "App exchanges code for access token" },
    { title: "Access Protected Resources", description: "App uses token to fetch user data" }
  ];

  const startFlow = () => {
    setStep(0);
    setTokens({ authCode: '', accessToken: '', refreshToken: '' });
    setUserData({ name: '', email: '', avatar: '' });
    setIsAnimating(true);
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      
      // Simulate token generation
      if (step === 3) {
        setTokens(prev => ({ ...prev, authCode: 'auth_code_xyz123' }));
      } else if (step === 4) {
        setTokens(prev => ({ 
          ...prev, 
          accessToken: 'access_token_abc789',
          refreshToken: 'refresh_token_def456'
        }));
      } else if (step === 5) {
        setUserData({
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'JD'
        });
      }
    } else {
      setIsAnimating(false);
    }
  };

  const resetFlow = () => {
    setStep(0);
    setTokens({ authCode: '', accessToken: '', refreshToken: '' });
    setUserData({ name: '', email: '', avatar: '' });
    setIsAnimating(false);
  };

  useEffect(() => {
    if (isAnimating && step < steps.length - 1) {
      const timer = setTimeout(nextStep, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, isAnimating]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">OAuth 2.0 Authorization Flow</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive visualization of how OAuth allows secure third-party access without sharing passwords
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* User */}
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-500 ${
              step === 0 || step === 2 ? 'bg-blue-500 scale-110 shadow-lg' : 'bg-slate-400'
            }`}>
              👤
            </div>
            <h4 className="text-lg font-semibold mt-2 text-slate-700">User</h4>
            <p className="text-sm text-slate-500 text-center">Wants to sign in</p>
          </div>

          {/* Client App */}
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-500 ${
              step === 1 || step === 4 || step === 5 ? 'bg-indigo-500 scale-110 shadow-lg' : 'bg-slate-400'
            }`}>
              🌐
            </div>
            <h4 className="text-lg font-semibold mt-2 text-slate-700">Client App</h4>
            <p className="text-sm text-slate-500 text-center">Third-party website</p>
          </div>

          {/* Auth Server */}
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-500 ${
              step === 2 || step === 3 ? 'bg-emerald-500 scale-110 shadow-lg' : 'bg-slate-400'
            }`}>
              🔐
            </div>
            <h4 className="text-lg font-semibold mt-2 text-slate-700">Auth Server</h4>
            <p className="text-sm text-slate-500 text-center">Google OAuth</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                  index <= step ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 transition-colors duration-300 ${
                    index < step ? 'bg-blue-500' : 'bg-slate-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h5 className="text-lg font-semibold text-slate-800">{steps[step].title}</h5>
            <p className="text-slate-600">{steps[step].description}</p>
          </div>
        </div>

        {/* Tokens Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h6 className="font-semibold text-slate-700 mb-2">Authorization Code</h6>
            <div className={`text-xs font-mono p-2 rounded transition-all duration-500 ${
              tokens.authCode ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'
            }`}>
              {tokens.authCode || 'Not generated yet'}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h6 className="font-semibold text-slate-700 mb-2">Access Token</h6>
            <div className={`text-xs font-mono p-2 rounded transition-all duration-500 ${
              tokens.accessToken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
            }`}>
              {tokens.accessToken || 'Not generated yet'}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h6 className="font-semibold text-slate-700 mb-2">Refresh Token</h6>
            <div className={`text-xs font-mono p-2 rounded transition-all duration-500 ${
              tokens.refreshToken ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400'
            }`}>
              {tokens.refreshToken || 'Not generated yet'}
            </div>
          </div>
        </div>

        {/* User Data Display */}
        {userData.name && (
          <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6">
            <h6 className="font-semibold text-slate-700 mb-2">Retrieved User Data</h6>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {userData.avatar}
              </div>
              <div>
                <p className="font-medium text-slate-800">{userData.name}</p>
                <p className="text-sm text-slate-600">{userData.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={startFlow}
            disabled={isAnimating}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnimating ? 'Running...' : 'Start OAuth Flow'}
          </button>
          <button
            onClick={resetFlow}
            className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}