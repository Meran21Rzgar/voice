import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Square,
  Sparkles,
  Download,
  Key,
  Check,
  Copy,
  ExternalLink,
  Code2,
  Info,
  Layers,
  Zap,
  Mic,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Headphones,
  RefreshCw,
  AlertCircle,
  Globe,
  User,
  Volume1
} from 'lucide-react';

interface ProviderCard {
  name: string;
  badge: string;
  badgeColor: string;
  rating: number;
  freeTier: string;
  creditCard: string;
  website: string;
  bestFor: string;
  description: string;
  pros: string[];
  cons: string[];
  hasKurdish: boolean;
  hasEnglish: boolean;
}

const PROVIDERS: ProviderCard[] = [
  {
    name: 'ElevenLabs',
    badge: 'Best English Voice Quality',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    rating: 5,
    freeTier: '10,000 characters/month (Renewed monthly)',
    creditCard: 'No credit card required for free tier',
    website: 'https://elevenlabs.io',
    bestFor: 'Hyper-realistic English narration, podcasts, games & storytelling',
    description: 'The world gold standard for hyper-realistic AI voice synthesis with human-like breathing, natural pauses, and emotional depth.',
    pros: [
      'Indistinguishable from real human voice actors',
      'Wide library of natural English male and female voices',
      'Instant API key upon signing up with email/Google',
      'Multilingual v2 and Turbo v2.5 models'
    ],
    cons: [
      '10,000 characters free limit per month',
      'Kurdish requires phonetic or custom voice matching'
    ],
    hasKurdish: false,
    hasEnglish: true,
  },
  {
    name: 'KurdishTTS.com',
    badge: 'Dedicated Kurdish Voices',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    rating: 4.9,
    freeTier: '20,000 characters/month free (renewed monthly)',
    creditCard: 'No credit card required',
    website: 'https://kurdishtts.com',
    bestFor: 'Native Sorani & Kurmanji speech, Kurdish apps, audiobooks',
    description: 'The premier dedicated platform built specifically for Kurdish speech synthesis, featuring over 800 male and female voices for both Sorani and Kurmanji.',
    pros: [
      'Authentic native Sorani (Arabic script) and Kurmanji (Latin script)',
      'Diverse male and female voices (Aland, Rojin, Berivan, Diyar, Bager)',
      '20,000 characters free every month with free API key',
      'Simple REST API and MCP protocol support'
    ],
    cons: [
      'Dedicated primarily to Kurdish dialects',
      'Max 500 characters per single request on free plan'
    ],
    hasKurdish: true,
    hasEnglish: false,
  },
  {
    name: 'Google Gemini 3.8 Flash Lite TTS',
    badge: 'Modern AI Voice (English & Kurdish)',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    rating: 4.8,
    freeTier: 'Generous free rate limits in Google AI Studio',
    creditCard: 'No credit card required in Google AI Studio',
    website: 'https://aistudio.google.com',
    bestFor: 'AI apps, multi-language speech, English & Kurdish male/female voices',
    description: 'Google’s next-generation audio model supporting natural prosody and promptable voice personas for English and Kurdish.',
    pros: [
      'Direct WAV audio output (24kHz high fidelity)',
      'Supports both English and Kurdish male and female speakers',
      'Free tier available with Gemini API key at aistudio.google.com',
      'Fast response latency with flash-lite model'
    ],
    cons: [
      'Requires server-side API call',
      'API rate limits on free tier (RPM/TPM)'
    ],
    hasKurdish: true,
    hasEnglish: true,
  },
  {
    name: 'Web Speech API (Browser Native)',
    badge: '100% Free & No Key Needed',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    rating: 4.5,
    freeTier: 'Unlimited forever (0 API key, 0 cost)',
    creditCard: 'No account, no key, no card',
    website: 'https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis',
    bestFor: 'Instant English & local language reading in browsers',
    description: 'Built directly into Chrome, Edge, Safari, and Firefox with natural English neural voices like Microsoft Jenny, Guy, and Google US English.',
    pros: [
      'Zero API key or sign-up needed',
      'Zero latency (runs directly in user’s browser)',
      'Works completely offline',
      'Unlimited characters'
    ],
    cons: [
      'Kurdish voice availability depends on user device language packs',
      'Cannot save direct audio file without media recorder'
    ],
    hasKurdish: false,
    hasEnglish: true,
  }
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'studio' | 'english' | 'kurdish' | 'elevenlabs' | 'matrix' | 'code'>('studio');

  // Studio language state (Default to English as requested, toggleable to Kurdish)
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ku'>('en');
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');

  // English Studio State
  const [englishVoice, setEnglishVoice] = useState<string>('Kore');
  const [englishText, setEnglishText] = useState<string>(
    'Hello! This voice can read any text for your project clearly. You can choose between female and male voices.'
  );

  // Kurdish Studio State
  const [kurdishDialect, setKurdishDialect] = useState<'sorani' | 'kurmanji'>('sorani');
  const [kurdishText, setKurdishText] = useState<string>(
    'سڵاو! بەخێربێن، ئەم دەنگە دەتوانێت هەموو دەقە کوردییەکانت بۆ بخوێنێتەوە بە دەنگی کچان یان کوڕان.'
  );

  // Audio Playback & Generation State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Browser Speech Synthesis state
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoiceIdx, setSelectedBrowserVoiceIdx] = useState<number>(0);
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isBrowserSpeaking, setIsBrowserSpeaking] = useState<boolean>(false);

  // ElevenLabs tester state
  const [elevenKey, setElevenKey] = useState<string>('');
  const [elevenVoiceId, setElevenVoiceId] = useState<string>('21m00Tcm4TlvDq8ikWAM'); // Rachel
  const [elevenText, setElevenText] = useState<string>(
    'Hi! This is Rachel from ElevenLabs. Our English voices sound completely natural and human.'
  );
  const [elevenLoading, setElevenLoading] = useState<boolean>(false);
  const [elevenAudioUrl, setElevenAudioUrl] = useState<string | null>(null);
  const [elevenError, setElevenError] = useState<string | null>(null);

  // Code snippet state
  const [selectedSnippet, setSelectedSnippet] = useState<'english-browser' | 'kurdish-js' | 'gemini-ts' | 'elevenlabs-js' | 'kurdish-py'>('english-browser');
  const [copied, setCopied] = useState<boolean>(false);

  // Load browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setBrowserVoices(available);
        if (available.length > 0) {
          const preferredIdx = available.findIndex(
            v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Guy'))
          );
          if (preferredIdx !== -1) {
            setSelectedBrowserVoiceIdx(preferredIdx);
          } else {
            const enIdx = available.findIndex(v => v.lang.startsWith('en'));
            if (enIdx !== -1) setSelectedBrowserVoiceIdx(enIdx);
          }
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // When switching language in the main studio
  const handleLanguageSwitch = (lang: 'en' | 'ku') => {
    setSelectedLanguage(lang);
    setErrorMessage(null);
    if (lang === 'en') {
      setEnglishVoice(voiceGender === 'female' ? 'Kore' : 'Charon');
    } else {
      if (kurdishDialect === 'sorani') {
        setKurdishText('سڵاو! بەخێربێن بۆ پرۆژەکەم، ئەم دەنگە دەتوانێت دەقە کوردییەکان بە جوانی بخوێنێتەوە.');
      } else {
        setKurdishText('Silav! Tu bi xêr hatî bo vê projeyê, ev deng dikare hemû nivîsên kurdî bixwîne.');
      }
    }
  };

  // When switching gender
  const handleGenderSwitch = (gender: 'female' | 'male') => {
    setVoiceGender(gender);
    setErrorMessage(null);
    if (selectedLanguage === 'en') {
      setEnglishVoice(gender === 'female' ? 'Kore' : 'Charon');
    }
  };

  // Convert base64 to Blob helper
  const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  // Main Speak Handler (Works for BOTH English and Kurdish, Male and Female)
  const handleSpeakMain = async () => {
    setIsSynthesizing(true);
    setErrorMessage(null);

    const isKurdish = selectedLanguage === 'ku';
    const textToSpeak = isKurdish ? kurdishText : englishText;

    if (!textToSpeak.trim()) {
      setErrorMessage('Please enter some text to speak.');
      setIsSynthesizing(false);
      return;
    }

    try {
      const voiceToUse = voiceGender === 'female' ? (englishVoice === 'Zephyr' ? 'Zephyr' : 'Kore') : (englishVoice === 'Puck' ? 'Puck' : 'Charon');
      
      const res = await fetch('/api/tts/instant-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          lang: isKurdish ? (kurdishDialect === 'sorani' ? 'ckb' : 'ku') : 'en',
          gender: voiceGender,
          dialect: kurdishDialect,
          voice: voiceToUse
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to synthesize speech.');
      }

      if (data.audioBase64) {
        const audioBlob = b64toBlob(data.audioBase64, data.format || 'audio/wav');
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const audio = new Audio(url);
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      }
    } catch (err: any) {
      // If server error, fallback to browser speech synthesis for English immediately
      if (!isKurdish && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.rate = 1.0;
          utterance.pitch = voiceGender === 'female' ? 1.1 : 0.9;
          if (browserVoices.length > 0) {
            utterance.voice = browserVoices[selectedBrowserVoiceIdx];
          }
          window.speechSynthesis.speak(utterance);
          setErrorMessage(null);
          return;
        } catch (e) {
          // ignore
        }
      }
      setErrorMessage(err.message || 'Speech generation failed. Please try again.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Browser Speech Handler
  const handlePlayBrowserSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    if (!englishText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(englishText);
    if (browserVoices[selectedBrowserVoiceIdx]) {
      utterance.voice = browserVoices[selectedBrowserVoiceIdx];
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsBrowserSpeaking(true);
    utterance.onend = () => setIsBrowserSpeaking(false);
    utterance.onerror = () => setIsBrowserSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopBrowserSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsBrowserSpeaking(false);
    }
  };

  // ElevenLabs Test
  const handleGenerateElevenLabs = async () => {
    if (!elevenKey.trim()) {
      setElevenError('Please enter your ElevenLabs API key first (free at elevenlabs.io).');
      return;
    }
    setElevenLoading(true);
    setElevenError(null);
    try {
      const res = await fetch('/api/tts/elevenlabs-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: elevenKey,
          text: elevenText,
          voiceId: elevenVoiceId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ElevenLabs request failed.');

      if (data.audioBase64) {
        const audioBlob = b64toBlob(data.audioBase64, data.format || 'audio/mpeg');
        const url = URL.createObjectURL(audioBlob);
        setElevenAudioUrl(url);

        const audio = new Audio(url);
        audio.play().catch(() => {});
      }
    } catch (err: any) {
      setElevenError(err.message || 'Failed to call ElevenLabs API.');
    } finally {
      setElevenLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Code snippets collection
  const codeSnippets: Record<string, { title: string; lang: string; code: string; notes: string }> = {
    'english-browser': {
      title: 'English Text-to-Speech (JavaScript / Browser Web Speech API)',
      lang: 'javascript',
      notes: '100% Free forever, no API key needed, works in all modern browsers.',
      code: `// Read English text aloud (0 key needed, instant client-side)
function speakEnglish(text, isFemale = true) {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Customizing tone and speed
  utterance.rate = 1.0;
  utterance.pitch = isFemale ? 1.1 : 0.9;

  // Pick an English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  if (englishVoice) utterance.voice = englishVoice;

  window.speechSynthesis.speak(utterance);
}

// Example usage:
speakEnglish("Hello! Your project can speak English text with zero API keys.");`
    },
    'kurdish-js': {
      title: 'Kurdish Text-to-Speech (JavaScript)',
      lang: 'javascript',
      notes: 'Read Kurdish Sorani (Arabic script) or Kurmanji (Latin script).',
      code: `// Kurdish Text-to-Speech with Male and Female support
async function speakKurdish(text, dialect = 'sorani', gender = 'female') {
  const response = await fetch('/api/tts/instant-speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      dialect: dialect, // 'sorani' or 'kurmanji'
      gender: gender    // 'female' or 'male'
    })
  });

  const data = await response.json();
  const audio = new Audio('data:audio/wav;base64,' + data.audioBase64);
  audio.play();
}

// Example:
speakKurdish("سڵاو! بەخێربێن بۆ پرۆژەکەم", "sorani", "female");`
    },
    'gemini-ts': {
      title: 'Google Gemini 3.8 Flash Lite TTS (Node.js Express Backend)',
      lang: 'typescript',
      notes: 'Supports English & Kurdish male & female voices with 24kHz WAV audio.',
      code: `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

async function generateSpeech(text: string, voiceName: 'Kore' | 'Charon' = 'Kore', isKurdish: boolean = false) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash-lite-tts',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text,
            speechMetadata: {
              style: isKurdish
                ? 'Speak in clear, fluent Kurdish with native pronunciation'
                : 'Speak in clear, professional English'
            }
          }
        ]
      }
    ],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          // 'Kore' / 'Zephyr' for female, 'Charon' / 'Puck' for male
          prebuiltVoiceConfig: { voiceName }
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return Buffer.from(base64Audio, 'base64');
}`
    },
    'elevenlabs-js': {
      title: 'ElevenLabs Text-to-Speech (JavaScript / Fetch)',
      lang: 'javascript',
      notes: 'Best English voice realism (10,000 chars/month free at elevenlabs.io).',
      code: `async function generateElevenLabsAudio(text, apiKey) {
  const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // "Rachel" (Female) or "pNInz6obpgDQGcFmaJgB" (Adam - Male)
  
  const response = await fetch(\`https://api.elevenlabs.io/v1/text-to-speech/\${VOICE_ID}\`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    })
  });

  const audioBlob = await response.blob();
  const audio = new Audio(URL.createObjectURL(audioBlob));
  audio.play();
}`
    },
    'kurdish-py': {
      title: 'Kurdish Text-to-Speech with KurdishTTS.com (Python)',
      lang: 'python',
      notes: '20,000 free chars/month at kurdishtts.com.',
      code: `import requests

def speak_kurdish(text, voice="Rojin", dialect="sorani", api_key="YOUR_KURDISHTTS_KEY"):
    response = requests.post(
        "https://www.kurdishtts.com/api/tts-proxy",
        headers={"x-api-key": api_key, "Content-Type": "application/json"},
        json={"text": text, "voice": voice, "dialect": dialect}
    )
    with open("kurdish.mp3", "wb") as f:
        f.write(response.content)

# Female: "Rojin", "Berivan", "Arya"
# Male: "Aland", "Diyar", "Bager"
speak_kurdish("سڵاو! ئەم دەنگە کوردی دەخوێنێتەوە.", voice="Aland", dialect="sorani")`
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">Voice & Text-to-Speech Studio</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  English & Kurdish (Male & Female)
                </span>
              </div>
              <p className="text-xs text-slate-400">Read text aloud with natural female and male voices</p>
            </div>
          </div>

          {/* Language Quick Switcher in Header */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => handleLanguageSwitch('en')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedLanguage === 'en'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇬🇧 English Voices</span>
            </button>
            <button
              onClick={() => handleLanguageSwitch('ku')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedLanguage === 'ku'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>☀️ دەنگی کوردی (Kurdish)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-px mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'studio'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Volume2 className="w-4 h-4 text-indigo-400" />
            Voice Studio (English & Kurdish)
          </button>

          <button
            onClick={() => {
              setActiveTab('english');
              setSelectedLanguage('en');
            }}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'english'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Mic className="w-4 h-4 text-blue-400" />
            English Browser Speech (Zero Key)
          </button>

          <button
            onClick={() => {
              setActiveTab('kurdish');
              setSelectedLanguage('ku');
            }}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'kurdish'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            Kurdish Voices (سۆرانی & Kurmancî)
          </button>

          <button
            onClick={() => setActiveTab('elevenlabs')}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'elevenlabs'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            ElevenLabs Free Tester (10k Chars)
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'matrix'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            Provider Comparison
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            Code Snippets
          </button>
        </div>

        {/* TAB 1: MAIN UNIFIED VOICE STUDIO */}
        {(activeTab === 'studio' || activeTab === 'kurdish') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                {/* Header within Studio */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      {selectedLanguage === 'en' ? '🇬🇧 English Voice Studio' : '☀️ Kurdish Voice Studio (دەنگی کوردی)'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedLanguage === 'en'
                        ? 'Select Female or Male voice and click Speak to read text aloud.'
                        : 'دەنگی مێینە یان نێرینە هەڵبژێرە و کلیک بکە بۆ خوێندنەوەی دەق بە کوردی.'}
                    </p>
                  </div>

                  {/* Language Toggle Pills */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <button
                      onClick={() => handleLanguageSwitch('en')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedLanguage === 'en'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => handleLanguageSwitch('ku')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedLanguage === 'ku'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ☀️ کوردی (Kurdish)
                    </button>
                  </div>
                </div>

                {/* If Kurdish is selected: Dialect Picker */}
                {selectedLanguage === 'ku' && (
                  <div className="mb-5 p-3 rounded-xl bg-slate-950 border border-emerald-500/25 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-emerald-400">Kurdish Dialect (شێوەزار):</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setKurdishDialect('sorani');
                          setKurdishText('سڵاو! بەخێربێن بۆ پرۆژەکەم، ئەم دەنگە دەتوانێت دەقە کوردییەکان بە جوانی بخوێنێتەوە.');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          kurdishDialect === 'sorani'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        سۆرانی (Sorani - Central)
                      </button>
                      <button
                        onClick={() => {
                          setKurdishDialect('kurmanji');
                          setKurdishText('Silav! Tu bi xêr hatî bo vê projeyê, ev deng dikare hemû nivîsên kurdî bixwîne.');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          kurdishDialect === 'kurmanji'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        Kurmancî (Kurmanji - Northern)
                      </button>
                    </div>
                  </div>
                )}

                {/* Gender Selector (Female vs Male) */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Choose Voice Gender (کچان یان کوڕان):
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleGenderSwitch('female')}
                      className={`p-3.5 rounded-xl border flex items-center justify-center gap-3 transition-all cursor-pointer ${
                        voiceGender === 'female'
                          ? selectedLanguage === 'en'
                            ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50'
                            : 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <User className={`w-5 h-5 ${selectedLanguage === 'en' ? 'text-indigo-400' : 'text-emerald-400'}`} />
                      <div className="text-left">
                        <div className="text-sm font-bold">Female Voice (دەنگی مێینە)</div>
                        <div className="text-[11px] opacity-80">
                          {selectedLanguage === 'en' ? 'Kore / Zephyr (Clear, Warm & Friendly)' : 'Rojin / Kore (دەنگی کچان - نەرم و ڕوون)'}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleGenderSwitch('male')}
                      className={`p-3.5 rounded-xl border flex items-center justify-center gap-3 transition-all cursor-pointer ${
                        voiceGender === 'male'
                          ? selectedLanguage === 'en'
                            ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50'
                            : 'bg-teal-500/15 border-teal-500 text-teal-300 ring-1 ring-teal-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <User className={`w-5 h-5 ${selectedLanguage === 'en' ? 'text-indigo-400' : 'text-teal-400'}`} />
                      <div className="text-left">
                        <div className="text-sm font-bold">Male Voice (دەنگی نێرینە)</div>
                        <div className="text-[11px] opacity-80">
                          {selectedLanguage === 'en' ? 'Charon / Puck (Deep, Authoritative & Resonant)' : 'Aland / Charon (دەنگی کوڕان - بەهێز و پیاوانە)'}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Specific Voice Picker */}
                {selectedLanguage === 'en' && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      English Voice Persona:
                    </label>
                    <select
                      value={englishVoice}
                      onChange={e => setEnglishVoice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {voiceGender === 'female' ? (
                        <>
                          <option value="Kore">Kore (Female - Clear, balanced, versatile)</option>
                          <option value="Zephyr">Zephyr (Female - Bright, warm, conversational)</option>
                        </>
                      ) : (
                        <>
                          <option value="Charon">Charon (Male - Deep, resonant, narrative)</option>
                          <option value="Puck">Puck (Male - Youthful, energetic, friendly)</option>
                          <option value="Fenrir">Fenrir (Male - Confident, warm, news anchor)</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {/* Text Box */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {selectedLanguage === 'en'
                        ? 'Text to read aloud:'
                        : kurdishDialect === 'sorani'
                        ? 'دەقی کوردی (سۆرانی):'
                        : 'Nivîsa Kurdî (Kurmancî):'}
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {(selectedLanguage === 'en' ? englishText : kurdishText).length} characters
                    </span>
                  </div>

                  <textarea
                    value={selectedLanguage === 'en' ? englishText : kurdishText}
                    onChange={e => {
                      if (selectedLanguage === 'en') setEnglishText(e.target.value);
                      else setKurdishText(e.target.value);
                    }}
                    dir={selectedLanguage === 'ku' && kurdishDialect === 'sorani' ? 'rtl' : 'ltr'}
                    rows={4}
                    className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y leading-relaxed ${
                      selectedLanguage === 'ku' && kurdishDialect === 'sorani' ? 'text-right' : 'text-left'
                    }`}
                    placeholder={
                      selectedLanguage === 'en'
                        ? 'Type or paste English text to read aloud...'
                        : 'دەقێکی کوردی لێرە بنووسە بۆ خوێندنەوە...'
                    }
                  />

                  {/* Sample Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-xs text-slate-400">Presets:</span>
                    {selectedLanguage === 'en' ? (
                      <>
                        <button
                          onClick={() =>
                            setEnglishText(
                              'Hello! This voice can read any text for your project clearly. You can choose between female and male voices.'
                            )
                          }
                          className="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        >
                          Greeting
                        </button>
                        <button
                          onClick={() =>
                            setEnglishText(
                              'Welcome to our application! We hope you have an incredible experience exploring our tools today.'
                            )
                          }
                          className="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        >
                          Welcome
                        </button>
                        <button
                          onClick={() =>
                            setEnglishText(
                              'System notification: Your files have been processed and the speech audio is ready for playback.'
                            )
                          }
                          className="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        >
                          Alert
                        </button>
                      </>
                    ) : kurdishDialect === 'sorani' ? (
                      <>
                        <button
                          onClick={() =>
                            setKurdishText(
                              'سڵاو! بەخێربێن بۆ پرۆژەکەم، ئەم دەنگە دەتوانێت دەقە کوردییەکان بە جوانی بخوێنێتەوە.'
                            )
                          }
                          className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 transition-colors cursor-pointer"
                        >
                          سڵاو (Greeting)
                        </button>
                        <button
                          onClick={() =>
                            setKurdishText(
                              'بەیانیت باش! هیوادارم ئەمڕۆ رۆژێکی زۆر خۆش و بەرهەمدار بێت بۆ تۆ.'
                            )
                          }
                          className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 transition-colors cursor-pointer"
                        >
                          بەیانی باش (Morning)
                        </button>
                        <button
                          onClick={() =>
                            setKurdishText(
                              'ئەمڕۆ لە هەولێر و سلێمانی، کەشوهەوا زۆر خۆش و ئارام دەبێت.'
                            )
                          }
                          className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 transition-colors cursor-pointer"
                        >
                          هەواڵ (News)
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setKurdishText(
                              'Silav! Tu bi xêr hatî bo vê projeyê, ev deng dikare hemû nivîsên kurdî bixwîne.'
                            )
                          }
                          className="text-xs px-2 py-0.5 rounded bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 border border-teal-800/40 transition-colors cursor-pointer"
                        >
                          Silav (Greeting)
                        </button>
                        <button
                          onClick={() =>
                            setKurdishText(
                              'Rojbaş! Hêvî dikim rojeke pir xweş û serkeftî derbas bikî.'
                            )
                          }
                          className="text-xs px-2 py-0.5 rounded bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 border border-teal-800/40 transition-colors cursor-pointer"
                        >
                          Rojbaş (Morning)
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl mb-4 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={handleSpeakMain}
                    disabled={isSynthesizing}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
                      selectedLanguage === 'en'
                        ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                    }`}
                  >
                    {isSynthesizing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating Audio...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        {selectedLanguage === 'en'
                          ? `Speak in English (${voiceGender === 'female' ? 'Female Voice' : 'Male Voice'})`
                          : `دەنگەکە لێبدە (${voiceGender === 'female' ? 'دەنگی کچان' : 'دەنگی کوڕان'})`}
                      </>
                    )}
                  </button>

                  {audioUrl && (
                    <a
                      href={audioUrl}
                      download={`voice-${selectedLanguage}-${voiceGender}.wav`}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-indigo-400" />
                      Download WAV Audio
                    </a>
                  )}

                  {isPlaying && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium ml-auto">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Playing voice...
                    </div>
                  )}
                </div>

                {/* Audio player if generated */}
                {audioUrl && (
                  <div className="mt-5 p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-indigo-400" />
                      Audio Player ({selectedLanguage.toUpperCase()} - {voiceGender.toUpperCase()}):
                    </div>
                    <audio controls className="w-full" src={audioUrl} autoPlay />
                  </div>
                )}
              </div>

              {/* Quick Code Preview */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    Copy integration code for {selectedLanguage === 'en' ? 'English' : 'Kurdish'} voice:
                  </span>
                  <button
                    onClick={() =>
                      handleCopyCode(
                        selectedLanguage === 'en'
                          ? codeSnippets['english-browser'].code
                          : codeSnippets['kurdish-js'].code
                      )
                    }
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg text-slate-300 overflow-x-auto border border-slate-800/60">
                  {selectedLanguage === 'en'
                    ? `const utterance = new SpeechSynthesisUtterance("Hello world!");\nwindow.speechSynthesis.speak(utterance);`
                    : `fetch('/api/tts/instant-speech', { method: 'POST', body: JSON.stringify({ text: 'سڵاو!', gender: 'female' }) });`}
                </pre>
              </div>
            </div>

            {/* Sidebar Guide */}
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Voice Overview
                </h4>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <strong className="text-indigo-300 block mb-1">🇬🇧 English Voices</strong>
                    <ul className="text-slate-400 space-y-1 text-[11px]">
                      <li>• 👩 <strong>Female:</strong> Kore, Zephyr, Rachel (ElevenLabs), Jenny</li>
                      <li>• 👨 <strong>Male:</strong> Charon, Puck, Fenrir, Adam (ElevenLabs), Guy</li>
                      <li>• 100% free browser synthesis or studio-grade AI audio.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <strong className="text-emerald-300 block mb-1">☀️ Kurdish Voices (دەنگی کوردی)</strong>
                    <ul className="text-slate-400 space-y-1 text-[11px]">
                      <li>• 👩 <strong>Female (کچان):</strong> Kore, Rojin, Berivan, Arya</li>
                      <li>• 👨 <strong>Male (کوڕان):</strong> Charon, Aland, Diyar, Bager</li>
                      <li>• Dialects: Sorani (سۆرانی) and Kurmanji (Kurmancî).</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  Need ultra-realistic voice actors?
                </h4>
                <p className="text-slate-400 leading-relaxed mb-3">
                  Check the <strong>ElevenLabs</strong> tab for 10,000 characters free per month with world-class human-like inflections!
                </p>
                <button
                  onClick={() => setActiveTab('elevenlabs')}
                  className="w-full py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Open ElevenLabs Tester <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED ENGLISH BROWSER PLAYGROUND */}
        {activeTab === 'english' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">English Browser Speech Synthesis</h3>
                      <p className="text-xs text-slate-400">Web Speech API — 100% Free, zero keys, runs locally</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                    {browserVoices.length} System Voices Detected
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    English Text to read:
                  </label>
                  <textarea
                    value={englishText}
                    onChange={e => setEnglishText(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y"
                    placeholder="Type English text to hear it spoken..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Select Installed Voice:
                    </label>
                    <select
                      value={selectedBrowserVoiceIdx}
                      onChange={e => setSelectedBrowserVoiceIdx(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      {browserVoices.map((v, idx) => (
                        <option key={idx} value={idx}>
                          {v.name} ({v.lang}) {v.default ? '★ Default' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                        <span>Speed (Rate): {rate}x</span>
                        <span className="text-slate-500">1.0x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={rate}
                        onChange={e => setRate(parseFloat(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                        <span>Pitch: {pitch}</span>
                        <span className="text-slate-500">1.0</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={pitch}
                        onChange={e => setPitch(parseFloat(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={handlePlayBrowserSpeech}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {isBrowserSpeaking ? 'Restart English Speech' : 'Read English Aloud Now'}
                  </button>

                  {isBrowserSpeaking && (
                    <button
                      onClick={handleStopBrowserSpeech}
                      className="px-4 py-2.5 rounded-xl font-medium text-sm bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Why start with Web Speech API?
                </h4>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li>• Zero API key or configuration required</li>
                  <li>• Runs 100% on the client device</li>
                  <li>• Unlimited usage with zero billing</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ELEVENLABS TESTER */}
        {activeTab === 'elevenlabs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">ElevenLabs Live API Tester</h3>
                      <p className="text-xs text-slate-400">10,000 characters free every month (Gold standard voice realism)</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    10k Free Chars
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Your ElevenLabs API Key:</span>
                    <a
                      href="https://elevenlabs.io"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline font-normal flex items-center gap-1"
                    >
                      Get free key at elevenlabs.io <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <input
                    type="password"
                    value={elevenKey}
                    onChange={e => setElevenKey(e.target.value)}
                    placeholder="Paste your ElevenLabs xi-api-key here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Select English Voice:
                    </label>
                    <select
                      value={elevenVoiceId}
                      onChange={e => setElevenVoiceId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Female - Calm, warm)</option>
                      <option value="EXAVITQu4vr4xnSDxMaL">Bella (Female - Cheerful)</option>
                      <option value="ErXwobaYiN019PkySvjV">Antoni (Male - Narration)</option>
                      <option value="VR6AewLTigWG4xSOukaG">Arnold (Male - Resonant)</option>
                      <option value="pNInz6obpgDQGcFmaJgB">Adam (Male - Classic narrator)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Model:
                    </label>
                    <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
                      eleven_multilingual_v2
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Text to read:
                  </label>
                  <textarea
                    value={elevenText}
                    onChange={e => setElevenText(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-y"
                    placeholder="Enter text to read with ElevenLabs..."
                  />
                </div>

                {elevenError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl mb-4 text-xs text-red-300">
                    {elevenError}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={handleGenerateElevenLabs}
                    disabled={elevenLoading}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white flex items-center gap-2 shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
                  >
                    {elevenLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Synthesizing Voice...
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Test Free API Key
                      </>
                    )}
                  </button>

                  {elevenAudioUrl && (
                    <a
                      href={elevenAudioUrl}
                      download="elevenlabs-sample.mp3"
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      Download MP3
                    </a>
                  )}
                </div>

                {elevenAudioUrl && (
                  <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-xs font-semibold text-slate-300 mb-2">ElevenLabs Playback:</div>
                    <audio controls className="w-full" src={elevenAudioUrl} autoPlay />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  Free Tier Details
                </h4>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li>• 10,000 characters free each month</li>
                  <li>• No credit card required to start</li>
                  <li>• Over 1,000 community & default voices</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPARISON MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">TTS Provider Comparison (English & Kurdish)</h3>
              <p className="text-sm text-slate-400">
                Compare character quotas, language support, and features across free providers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROVIDERS.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg text-white">{p.name}</h4>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">{p.description}</p>

                    <div className="space-y-2 mb-4 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Free Quota</span>
                        <span className="text-emerald-400 font-semibold">{p.freeTier}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">English</span>
                          <span className={p.hasEnglish ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {p.hasEnglish ? '✓ Supported' : 'Limited'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Kurdish</span>
                          <span className={p.hasKurdish ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {p.hasKurdish ? '✓ Supported' : 'Phonetic only'}
                          </span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Credit Card Needed?</span>
                        <span className="text-slate-200">{p.creditCard}</span>
                      </div>
                    </div>

                    <div className="text-xs mb-4">
                      <div className="font-semibold text-slate-300 mb-1.5">Pros:</div>
                      <ul className="space-y-1 text-slate-400">
                        {p.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href={p.website}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 mt-2"
                  >
                    Visit Official Website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: READY-TO-USE CODE SNIPPETS */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Ready-to-Use Code Snippets</h3>
              <p className="text-sm text-slate-400">
                Copy and paste these snippets directly into your project to start reading text aloud.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSnippet('english-browser')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSnippet === 'english-browser'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                1. English Web Speech (JS)
              </button>
              <button
                onClick={() => setSelectedSnippet('kurdish-js')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSnippet === 'kurdish-js'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                2. Kurdish Voice (JS)
              </button>
              <button
                onClick={() => setSelectedSnippet('gemini-ts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSnippet === 'gemini-ts'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                3. Gemini TTS (Node.js)
              </button>
              <button
                onClick={() => setSelectedSnippet('elevenlabs-js')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSnippet === 'elevenlabs-js'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                4. ElevenLabs (JS)
              </button>
              <button
                onClick={() => setSelectedSnippet('kurdish-py')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSnippet === 'kurdish-py'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                5. KurdishTTS (Python)
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    {codeSnippets[selectedSnippet].title}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {codeSnippets[selectedSnippet].notes}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCode(codeSnippets[selectedSnippet].code)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed bg-slate-950">
                <code>{codeSnippets[selectedSnippet].code}</code>
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Text-to-Speech Explorer • English & Kurdish Male & Female Voices</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => handleLanguageSwitch('en')} className="hover:text-white transition-colors cursor-pointer">
              🇬🇧 English Voices
            </button>
            <span>•</span>
            <button onClick={() => handleLanguageSwitch('ku')} className="hover:text-white transition-colors cursor-pointer">
              ☀️ Kurdish Voices (کوردی)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
