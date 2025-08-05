'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Key, Save } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

export default function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsValid(true);
      onApiKeyChange(savedApiKey);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setIsValid(true);
      onApiKeyChange(apiKey.trim());
    }
  };

  const handleChange = (value: string) => {
    setApiKey(value);
    setIsValid(value.startsWith('sk-') && value.length > 20);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          OpenAI API Key
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter your OpenAI API key (sk-...)"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        <button
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Save API Key
        </button>
        
        {isValid && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            API Key saved and ready to use
          </div>
        )}
      </div>
    </div>
  );
}