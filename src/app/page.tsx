'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import ApiKeyInput from '@/components/ApiKeyInput';
import PdfUpload from '@/components/PdfUpload';
import ChatInterface from '@/components/ChatInterface';
import { ThemeProvider } from '@/components/ThemeProvider';
import { VoiceProvider } from '@/components/VoiceProvider';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [pdfText, setPdfText] = useState('');
  const [fileName, setFileName] = useState('');

  const handlePdfUpload = (text: string, name: string) => {
    setPdfText(text);
    setFileName(name);
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
  };

  return (
    <ThemeProvider>
      <VoiceProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              {/* Aditi Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                  <Image
                    src="/aditi-logo-2.0.png"
                    alt="Aditi Consulting Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Aditi Consulting AI
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
                Advanced AI-powered document analysis platform. Upload PDFs and get intelligent insights using cutting-edge artificial intelligence technology.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> Works best with text-based PDFs. Scanned documents or image-only PDFs won't work.
                </p>
              </div>
              
              {/* Quick Start Steps */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Enter API Key
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Upload PDF
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Start Chatting
                </div>
              </div>
            </div>

            {/* Main Content */}
            {!pdfText ? (
              // Setup Phase - Show API Key and PDF Upload side by side
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Setup */}
                <div className="space-y-6">
                  <ApiKeyInput onApiKeyChange={handleApiKeyChange} />
                </div>

                {/* Right Column - Upload */}
                <div className="space-y-6">
                  <PdfUpload onPdfUpload={handlePdfUpload} />
                </div>
              </div>
            ) : (
              // Chat Phase - Show chat interface in center with full width
              <div className="space-y-6">
                {/* Small API Key and File Info Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">API Key Connected</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">PDF: {fileName}</span>
                      <button
                        onClick={() => {
                          setPdfText('');
                          setFileName('');
                        }}
                        className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>

                {/* Full Width Chat Interface */}
                <div className="w-full">
                  <ChatInterface 
                    pdfText={pdfText}
                    apiKey={apiKey}
                    fileName={fileName}
                  />
                </div>
              </div>
            )}

            {/* Features Section - Only show when no PDF is uploaded */}
            {!pdfText && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Secure & Private
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your API key is stored locally and never sent to our servers
                  </p>
                </div>

                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Lightning Fast
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Get instant answers from your documents with AI-powered search
                  </p>
                </div>

                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Smart Analysis
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Advanced AI understands context and provides accurate answers
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
        </div>
      </VoiceProvider>
    </ThemeProvider>
  );
}