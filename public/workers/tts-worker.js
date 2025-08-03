// TTS Web Worker for local text-to-speech synthesis
let ttsInstance = null;
let isInitialized = false;

// Import TTS model (this would be the actual implementation)
// For demo purposes, we'll simulate the functionality
async function loadTTSModel(modelUrl, config) {
  try {
    // In a real implementation, this would load the TTS model
    console.log('Loading TTS model from:', modelUrl);
    console.log('TTS config:', config);
    
    // Simulate model loading
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock TTS instance
    ttsInstance = {
      synthesize: async (text, config) => {
        // Simulate TTS processing
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Generate a simple audio buffer for demo
        const sampleRate = config.sampleRate || 22050;
        const duration = Math.min(text.length * 0.1, 3.0); // Duration based on text length
        const samples = Math.floor(sampleRate * duration);
        
        // Create a simple sine wave audio buffer
        const audioBuffer = new ArrayBuffer(samples * 2);
        const view = new DataView(audioBuffer);
        
        for (let i = 0; i < samples; i++) {
          // Create a simple tone that varies based on text
          const frequency = 440 + (text.length % 10) * 50;
          const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.1;
          view.setInt16(i * 2, sample * 32767, true);
        }
        
        return {
          audioBuffer,
          sampleRate,
          duration
        };
      }
    };
    
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to load TTS model:', error);
    throw error;
  }
}

// Handle messages from the main thread
self.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  try {
    switch (type) {
      case 'init-tts':
        if (!isInitialized) {
          await loadTTSModel(data.modelUrl, data.config);
          self.postMessage({
            type: 'tts-ready',
            data: { success: true }
          });
        }
        break;

      case 'synthesize':
        if (!isInitialized || !ttsInstance) {
          throw new Error('TTS not initialized');
        }

        const result = await ttsInstance.synthesize(data.text, data.config);
        
        self.postMessage({
          type: 'synthesis-result',
          data: {
            audioBuffer: result.audioBuffer,
            sampleRate: result.sampleRate,
            duration: result.duration
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
  console.error('TTS Worker error:', event.error);
  self.postMessage({
    type: 'error',
    error: event.error.message
  });
});

// Unhandled promise rejection
self.addEventListener('unhandledrejection', (event) => {
  console.error('TTS Worker unhandled promise rejection:', event.reason);
  self.postMessage({
    type: 'error',
    error: event.reason.message || 'Unknown error'
  });
}); 