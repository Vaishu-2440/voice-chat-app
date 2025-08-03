export interface PerformanceTimer {
  stt: number;    // Speech-to-Text latency in ms
  api: number;    // OpenAI API latency in ms
  tts: number;    // Text-to-Speech latency in ms
  total: number;  // Total response time in ms
}

export interface AudioChunk {
  data: Float32Array;
  sampleRate: number;
  timestamp: number;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface TTSSynthesisResult {
  audioBuffer: ArrayBuffer;
  sampleRate: number;
  duration: number;
}

export interface OpenAIResponse {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
} 