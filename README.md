# Voice Chat Assistant

A Next.js application that provides voice chat functionality with local speech processing and AI responses. The app works offline except for OpenAI API calls, featuring local speech-to-text using Whisper WASM and local text-to-speech synthesis.

## 🚀 Features

- **Local Speech-to-Text**: Uses Whisper WASM in a Web Worker for fast, offline transcription
- **AI Integration**: OpenAI Chat Completion API for intelligent responses
- **Local Text-to-Speech**: Cached TTS engine for immediate audio playback
- **Offline Capability**: Service Worker caches essential files for offline operation
- **Performance Monitoring**: Real-time latency tracking for STT, API, TTS, and total response time
- **PWA Support**: Installable as a Progressive Web App
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## 🎯 Performance Targets

- **Speech-to-Text (Whisper WASM)**: < 300ms
- **OpenAI API**: < 800ms
- **Text-to-Speech (Local)**: < 200ms
- **Total Response Time**: < 1.2s

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Speech Processing**: Whisper WASM (Web Worker)
- **AI**: OpenAI GPT-3.5-turbo
- **TTS**: Local synthesis engine
- **PWA**: Service Worker, Web App Manifest
- **Audio**: Web Audio API, MediaRecorder API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voice-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for server-side API calls
- `NEXT_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key for client-side calls (optional)

### Model Files

The application expects the following model files in the `public/models/` directory:

- `whisper-tiny.bin`: Whisper WASM model for speech-to-text
- `tts-model.bin`: TTS model for text-to-speech synthesis

*Note: For demo purposes, the application uses mock implementations. In production, you would need to include actual model files.*

## 🎮 Usage

1. **Grant microphone permissions** when prompted
2. **Click "Start Recording"** to begin voice input
3. **Speak clearly** into your microphone
4. **Click "Stop Recording"** when finished
5. **Wait for processing** - the app will:
   - Transcribe your speech locally
   - Send the text to OpenAI
   - Generate an AI response
   - Synthesize audio locally
   - Play back the response

## 📊 Performance Monitoring

The application tracks and displays:
- **STT Latency**: Time taken for speech-to-text conversion
- **API Latency**: Time for OpenAI API response
- **TTS Latency**: Time for text-to-speech synthesis
- **Total Response Time**: End-to-end processing time

Performance metrics are color-coded:
- 🟢 Green: Target met
- 🟡 Yellow: Within 20% of target
- 🔴 Red: Exceeds target

## 🔄 Offline Functionality

The Service Worker provides offline capabilities:
- **Caches static files** on first load
- **Works offline** except for OpenAI API calls
- **Background sync** for pending requests
- **Push notifications** support

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Microphone    │    │   Web Worker    │    │   OpenAI API    │
│   Input         │───▶│   (Whisper)     │───▶│   (GPT-3.5)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Audio Output  │◀───│   Web Worker    │◀───│   AI Response   │
│   (Playback)    │    │   (TTS)         │    │   (Text)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🧪 Testing

### Manual Testing
1. Test microphone access and recording
2. Verify transcription accuracy
3. Check AI response generation
4. Confirm audio playback
5. Test offline functionality
6. Monitor performance metrics

### Performance Testing
- Use browser DevTools to monitor network requests
- Check Service Worker cache status
- Verify Web Worker communication
- Monitor memory usage and performance

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Deploy to your preferred platform

## 📝 API Documentation

### OpenAI API Endpoint
- **POST** `/api/openai`
- **Body**: `{ message: string }`
- **Response**: `{ text: string, usage: object }`

### Web Workers
- **Whisper Worker**: `/workers/whisper-worker.js`
- **TTS Worker**: `/workers/tts-worker.js`

## 🔒 Security Considerations

- API keys are stored server-side
- HTTPS is required for microphone access
- Service Worker runs in secure context
- Audio data is processed locally

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for GPT API
- Whisper team for speech recognition
- Next.js team for the framework
- Tailwind CSS for styling

## 📞 Support

For questions or issues:
- Email: vikas@codingjr.online
- Include your full name and phone number
- Provide detailed description of the issue

---

**Note**: This is a demo implementation for internship evaluation. In production, you would need to integrate actual Whisper WASM and TTS models. 