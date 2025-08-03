// Whisper Web Worker for local speech-to-text processing
let whisperInstance = null;
let isInitialized = false;

// Import Whisper WASM (this would be the actual implementation)
// For demo purposes, we'll simulate the functionality
async function loadWhisperModel(modelUrl) {
  try {
    // In a real implementation, this would load the Whisper WASM model
    console.log('Loading Whisper model from:', modelUrl);
    
    // Simulate model loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Whisper instance with better simulation
    whisperInstance = {
      transcribe: async (audioData, sampleRate) => {
        // Simulate transcription processing
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Analyze audio data length to simulate more realistic transcription
        const audioLength = audioData.byteLength;
        const duration = audioLength / (sampleRate * 2); // Approximate duration in seconds
        
        // More realistic mock responses based on audio length and content simulation
        let mockText = "";
        
        // Simulate different types of speech based on duration
        if (duration < 1) {
          mockText = "Hi";
        } else if (duration < 2) {
          mockText = "Hello";
        } else if (duration < 3) {
          mockText = "How are you?";
        } else if (duration < 4) {
          mockText = "What's the weather like?";
        } else if (duration < 5) {
          mockText = "Can you help me with something?";
        } else if (duration < 6) {
          mockText = "Tell me a joke";
        } else if (duration < 7) {
          mockText = "What time is it?";
        } else if (duration < 8) {
          mockText = "How do I make coffee?";
        } else if (duration < 9) {
          mockText = "What's the capital of France?";
        } else {
          mockText = "Can you explain how this voice assistant works?";
        }
        
        return {
          text: mockText,
          confidence: 0.85 + Math.random() * 0.1
        };
      }
    };
    
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to load Whisper model:', error);
    throw error;
  }
}

// Handle messages from the main thread
self.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  try {
    switch (type) {
      case 'init-whisper':
        if (!isInitialized) {
          await loadWhisperModel(data.modelUrl);
          self.postMessage({
            type: 'whisper-ready',
            data: { success: true }
          });
        }
        break;

      case 'transcribe':
        if (!isInitialized || !whisperInstance) {
          throw new Error('Whisper not initialized');
        }

        const result = await whisperInstance.transcribe(data.audioData, data.sampleRate);
        
        self.postMessage({
          type: 'transcription-result',
          data: {
            text: result.text,
            confidence: result.confidence
          }
        });
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message
    });
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Worker error:', event.error);
  self.postMessage({
    type: 'error',
    error: event.error.message
  });
});

// Unhandled promise rejection
self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  self.postMessage({
    type: 'error',
    error: event.reason.message || 'Unknown error'
  });
}); 