'use client';

import { useState, useEffect } from 'react';

export default function ChatPage() {
  const [prompt, setPrompt] = useState('');
  const [nickname, setNickname] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Read nickname from cookies on component mount
    const savedNickname = document.cookie.split('; ')
      .find(row => row.startsWith('nickname='))?.split('=')[1];
    if (savedNickname) setNickname(decodeURIComponent(savedNickname));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, nickname }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, there was an error processing your request.');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Chat</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname"
              className="w-full p-2 border rounded mb-2"
              disabled={isLoading}
            />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading || !nickname}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
          
          {response && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p>{response}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}