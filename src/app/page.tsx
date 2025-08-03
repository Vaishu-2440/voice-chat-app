'use client';

import { useState, useRef, useEffect } from 'react';
import VoiceChat from '@/components/VoiceChat';
import PerformanceMetrics from '@/components/PerformanceMetrics';

export default function Home() {
  const [isOnline, setIsOnline] = useState(true);
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);

  useEffect(() => {
    console.log('Voice Chat App is loading...');
    
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          setIsServiceWorkerRegistered(true);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Voice Chat Assistant
          </h1>
          <p className="text-gray-600">
            Speak naturally and get AI responses with local speech processing
          </p>
          
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className={`px-3 py-1 rounded-full ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </div>
            <div className={`px-3 py-1 rounded-full ${
              isServiceWorkerRegistered ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isServiceWorkerRegistered ? '🟢 SW Ready' : '🟡 SW Loading'}
            </div>
          </div>
        </header>

        <VoiceChat />
        <PerformanceMetrics />
      </div>
    </main>
  );
} 