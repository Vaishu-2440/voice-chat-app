'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useWhisperTranscription } from '@/hooks/useWhisperTranscription';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useTTSSynthesis } from '@/hooks/useTTSSynthesis';
import { PerformanceTimer } from '@/types/performance';

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceTimer>({
    stt: 0,
    api: 0,
    tts: 0,
    total: 0
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const { startRecording, stopRecording, audioBlob } = useVoiceRecorder();
  const { transcribe } = useWhisperTranscription();
  const { generateResponse } = useOpenAI();
  const { synthesize } = useTTSSynthesis();

  const handleStartRecording = useCallback(async () => {
    try {
      setIsRecording(true);
      setTranscript('');
      setAiResponse('');
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  }, [startRecording]);

  const handleStopRecording = useCallback(async () => {
    try {
      console.log('🔄 Starting voice processing...');
      setIsRecording(false);
      setIsProcessing(true);
      
      const startTime = performance.now();
      
      // Stop recording
      console.log('📹 Stopping recording...');
      await stopRecording();
      
      if (!audioBlob) {
        throw new Error('No audio recorded');
      }
      console.log('✅ Audio recorded successfully');

      // Step 1: Speech-to-Text
      console.log('🎤 Starting speech-to-text...');
      const sttStart = performance.now();
      const transcription = await transcribe(audioBlob);
      const sttEnd = performance.now();
      console.log('📝 Transcription result:', transcription);
      setTranscript(transcription);

      // Step 2: OpenAI API call
      console.log('🤖 Calling OpenAI API...');
      const apiStart = performance.now();
      const response = await generateResponse(transcription);
      const apiEnd = performance.now();
      console.log('💬 AI Response:', response);
      setAiResponse(response);

      // Step 3: Text-to-Speech
      console.log('🔊 Starting text-to-speech...');
      const ttsStart = performance.now();
      const audioBuffer = await synthesize(response);
      const ttsEnd = performance.now();
      console.log('🎵 Audio synthesis complete');

      // Play audio
      if (audioRef.current && audioBuffer) {
        const audioUrl = URL.createObjectURL(audioBuffer);
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        console.log('▶️ Playing audio response');
      }

      const totalTime = performance.now() - startTime;
      
      setPerformanceMetrics({
        stt: sttEnd - sttStart,
        api: apiEnd - apiStart,
        tts: ttsEnd - ttsStart,
        total: totalTime
      });

      console.log('✅ Voice processing complete!');
      setIsProcessing(false);
    } catch (error) {
      console.error('❌ Error processing voice input:', error);
      setIsProcessing(false);
    }
  }, [stopRecording, audioBlob, transcribe, generateResponse, synthesize]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Voice Interaction
        </h2>
        
        <div className="flex justify-center mb-6">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isProcessing}
            className={`px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-200 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-blue-500 hover:bg-blue-600'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : isRecording ? (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                Stop Recording
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                Start Recording
              </div>
            )}
          </button>
        </div>

        {isRecording && (
          <div className="text-red-500 font-medium">
            Recording... Speak now!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Your Speech
          </h3>
          <div className="bg-white rounded p-3 min-h-[100px] text-black font-medium">
            {transcript || 'Your transcribed speech will appear here...'}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            AI Response
          </h3>
          <div className="bg-white rounded p-3 min-h-[100px] text-black font-medium">
            {aiResponse || 'AI response will appear here...'}
          </div>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
} 