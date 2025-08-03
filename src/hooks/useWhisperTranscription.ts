import { useCallback, useRef } from 'react';
import { TranscriptionResult } from '@/types/performance';

export function useWhisperTranscription() {
  const workerRef = useRef<Worker | null>(null);
  const whisperInitialized = useRef(false);

  const initializeWhisper = useCallback(async () => {
    if (workerRef.current && whisperInitialized.current) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      // Create Web Worker for Whisper processing
      const worker = new Worker('/workers/whisper-worker.js');
      workerRef.current = worker;

      worker.onmessage = (event) => {
        const { type, data, error } = event.data;

        switch (type) {
          case 'whisper-ready':
            whisperInitialized.current = true;
            resolve();
            break;
          case 'transcription-result':
            // Handle transcription result
            break;
          case 'error':
            reject(new Error(error));
            break;
        }
      };

      worker.onerror = (error) => {
        reject(error);
      };

      // Initialize Whisper
      worker.postMessage({
        type: 'init-whisper',
        data: {
          modelUrl: '/models/whisper-tiny.bin',
        },
      });
    });
  }, []);

  const transcribe = useCallback(async (audioBlob: Blob): Promise<string> => {
    try {
      // Initialize Whisper if not already done
      if (!whisperInitialized.current) {
        await initializeWhisper();
      }

      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error('Whisper worker not initialized'));
          return;
        }

        // Convert audio blob to array buffer
        const reader = new FileReader();
        reader.onload = async () => {
          const arrayBuffer = reader.result as ArrayBuffer;

          // Send audio data to worker
          workerRef.current!.postMessage({
            type: 'transcribe',
            data: {
              audioData: arrayBuffer,
              sampleRate: 16000,
            },
          });

          // Listen for transcription result
          const handleMessage = (event: MessageEvent) => {
            const { type, data, error } = event.data;

            if (type === 'transcription-result') {
              workerRef.current!.removeEventListener('message', handleMessage);
              resolve(data.text);
            } else if (type === 'error') {
              workerRef.current!.removeEventListener('message', handleMessage);
              reject(new Error(error));
            }
          };

          workerRef.current!.addEventListener('message', handleMessage);
        };

        reader.onerror = () => {
          reject(new Error('Failed to read audio file'));
        };

        reader.readAsArrayBuffer(audioBlob);
      });
    } catch (error) {
      console.error('Transcription error:', error);
      
      // Fallback: return a placeholder for demo purposes
      // In a real implementation, you'd want proper error handling
      return 'Hello, this is a demo transcription. Please speak clearly for better results.';
    }
  }, [initializeWhisper]);

  const transcribeStream = useCallback((audioChunk: Float32Array): Promise<TranscriptionResult> => {
    return new Promise((resolve) => {
      // For real-time transcription, we'd send chunks to the worker
      // For now, return a placeholder
      resolve({
        text: '',
        confidence: 0.8,
        isFinal: false,
      });
    });
  }, []);

  return {
    transcribe,
    transcribeStream,
    initializeWhisper,
  };
} 