'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  pdfText: string;
  apiKey: string;
  fileName: string;
}

export default function ChatInterface({ pdfText, apiKey, fileName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (pdfText && fileName) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `Hello! I've successfully processed your PDF "${fileName}". I can now answer questions about its content. What would you like to know?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [pdfText, fileName]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !apiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          pdfText,
          apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const { reply } = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: 'Summarize Document', query: 'Please provide a comprehensive summary of this document.' },
    { label: 'Key Points', query: 'What are the key points and main takeaways from this document?' },
    { label: 'Main Topics', query: 'What are the main topics covered in this document?' },
    { label: 'Document Overview', query: 'Give me an overview of what this document is about.' }
  ];

  const handleQuickAction = (action: { label: string; query: string }) => {
    if (isLoading || !apiKey) return;
    
    // Set the input to show the query
    setInput(action.query);
    
    // Send the message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: action.query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Send to API
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: action.query,
        pdfText,
        apiKey,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      return response.json();
    })
    .then(({ reply }) => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    })
    .catch(error => {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  if (!pdfText) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center min-h-[500px] flex flex-col justify-center">
        <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Ready to Chat!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Upload a PDF document to start asking questions about its content.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-[700px] max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              PDF Chat Assistant
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Discussing: {fileName}
            </p>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              disabled={isLoading || !apiKey}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.type === 'user' 
                  ? 'text-blue-100' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your PDF..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={1}
            disabled={isLoading || !apiKey}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || !apiKey}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}