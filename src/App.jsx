import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Languages, Clipboard, RefreshCw } from 'lucide-react';

// --- API Configuration ---
// We are no longer using RapidAPI.
// We will call the Google Gemini API directly.
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=';

// !! ================== IMPORTANT LOCALHOST FIX ================== !!
// When running on your local machine (localhost), you MUST get your
// own free API key from Google AI Studio and paste it here.
// 1. Go to https://aistudio.google.com/app/apikey
// 2. Click "Create API key"
// 3. Copy the key and paste it below.
// The key provided by the Canvas environment (an empty string "")
// ONLY works inside the Canvas.
const apiKey = "AIzaSyC81YmB_Bptey9opTkP8O3HDcnRoR0glqI";
// !! ========================================================== !!


/**
 * Component 1: The Translator
 * Fulfills: "Create a text translator application using React, Tailwind"
 */
const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Hindi'); // Default to Hindi (name)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // A list of some common languages for the dropdown, focusing on India
  // Added flag emojis as requested.
  const languages = [
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  ];

  const handleTranslate = async () => {
    if (!inputText) return;
    
    if (apiKey === "YOUR_GOOGLE_AI_STUDIO_API_KEY_HERE") {
        setError("Please add your own Google AI Studio API key to the `apiKey` constant in app.jsx.");
        return;
    }

    setLoading(true);
    setError(null);
    setTranslatedText('');

    const apiUrl = `${GEMINI_API_URL}${apiKey}`;

    // We create a prompt for the AI model
    const prompt = `Translate the following English text to ${targetLanguage}:\n\n"${inputText}"\n\nTranslation:`;

    // This API uses POST and a JSON body in the Gemini format
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload)
    };

    try {
      const response = await fetch(apiUrl, options);
      
      if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error Data:", errorData);
          throw new Error(`API Error: ${errorData.error?.message || response.statusText} (Status: ${response.status})`);
      }

      const data = await response.json();
      
      // New Gemini API has a different response structure
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setTranslatedText(text.trim());
      } else if (data.message) {
        // Handle API-specific errors
        throw new Error(data.message);
      } else {
        console.error("Unexpected API response:", data);
        throw new Error('Invalid API response structure.');
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl space-y-4">
      <h2 className="text-2xl font-semibold text-white flex items-center">
        <Languages className="mr-2 text-blue-400" />
        Text Translator
      </h2>
      
      {/* API Key Warning */}
      {apiKey === "YOUR_GOOGLE_AI_STUDIO_API_KEY_HERE" && (
        <div className="p-3 bg-yellow-100/20 border-l-4 border-yellow-400 text-yellow-200 rounded-md">
          <p className="font-bold">Configuration Needed</p>
          <p>Please get a free API key from Google AI Studio and paste it into the `apiKey` variable in `app.jsx` to enable the translator.</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100/20 border-l-4 border-red-400 text-red-200 rounded-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Text */}
        <div className="space-y-2">
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-300">
            English
          </label>
          <textarea
            id="inputText"
            rows="5"
            className="w-full p-3 bg-gray-900/50 border border-white/10 rounded-lg shadow-sm text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Translated Text */}
        <div className="space-y-2">
          <label htmlFor="translatedText" className="block text-sm font-medium text-gray-300">
            Translated
          </label>
          <textarea
            id="translatedText"
            rows="5"
            readOnly
            className="w-full p-3 bg-gray-800 border border-white/10 rounded-lg shadow-sm text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Translation will appear here..."
            value={translatedText}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Language Selector */}
        <div className="flex-grow">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 sr-only">
            Target Language
          </label>
          <select
            id="language"
            className="w-full sm:w-auto p-3 bg-gray-800 border border-white/10 rounded-lg shadow-sm text-white focus:ring-blue-500 focus:border-blue-500"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              // We now use the full name (e.g., "Hindi") as the value
              // And add the flag emoji
              <option key={lang.code} value={lang.name}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={loading || !inputText}
          className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  );
};

/**
 * Component 2: The Random String Generator
 * Fulfills: "Create a basic React application that will help you to generate random strings. 
 * Please make sure that you have to use useState, useCallback & useEffect hooks"
 */
const PasswordGenerator = () => {
  // 1. useState hook
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const passwordRef = useRef(null);

  // 2. useCallback hook
  const generatePassword = useCallback(() => {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    
    setPassword(newPassword);
    setCopied(false); // Reset copied state on new password
  }, [length, includeNumbers, includeSymbols]); // Dependencies for useCallback

  // 3. useEffect hook
  useEffect(() => {
    generatePassword();
  }, [generatePassword]); // Dependency for useEffect

  // Copy to clipboard
  const copyToClipboard = () => {
    if (passwordRef.current) {
      passwordRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Show "Copied!" for 2 seconds
    }
  };

  return (
    <div className="p-6 bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl space-y-6">
      <h2 className="text-2xl font-semibold text-white">
        Random String (Password) Generator
      </h2>
      
      {/* Output Display */}
      <div className="relative flex">
        <input
          ref={passwordRef}
          type="text"
          readOnly
          value={password}
          className="w-full p-4 pr-24 font-mono text-lg text-white bg-gray-800 border border-white/10 rounded-lg"
        />
        <button
          onClick={copyToClipboard}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-20 px-3 m-1.5 text-sm font-medium text-gray-300 bg-white/10 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {copied ? 'Copied!' : <Clipboard className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Controls */}
      <div className="space-y-4">
        {/* Length Slider */}
        <div className="flex items-center justify-between">
          <label htmlFor="length" className="text-sm font-medium text-gray-300">
            Length: <span className="font-bold text-blue-400">{length}</span>
          </label>
          <input
            id="length"
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-2/3 cursor-pointer accent-blue-500"
          />
        </div>
        
        {/* Checkboxes */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              id="numbers"
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers((prev) => !prev)}
              className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="numbers" className="ml-2 block text-sm font-medium text-gray-300">
              Include Numbers (0-9)
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="symbols"
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols((prev) => !prev)}
              className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="symbols" className="ml-2 block text-sm font-medium text-gray-300">
              Include Symbols (!@#$)
            </label>
          </div>
        </div>
        
        {/* Regenerate Button */}
        <button
          onClick={generatePassword}
          className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Regenerate
        </button>
      </div>
    </div>
  );
};


/**
 * Main App Component
 * This component handles navigation between the two tools.
 * It simulates "Client side routing" using React state,
 * as `react-router-dom` is a separate package that
 * isn't suitable for a single-file environment.
 */
export default function App() {
  const [page, setPage] = useState('translator'); // 'translator' or 'password'

  const NavButton = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium rounded-md text-sm sm:text-base ${
        active
          ? 'bg-white text-blue-700 shadow-lg' // Active button is solid white
          : 'text-gray-300 hover:bg-white/10' // Inactive is transparent
      } focus:outline-none focus:ring-2 focus:ring-white transition-all`}
    >
      {children}
    </button>
  );

  return (
    // New dark gradient background
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 font-sans p-4 sm:p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-center text-white mb-4">
            Internship Projects
          </h1>
          {/* App Navigation (State-based routing) - Now glassy! */}
          <nav className="flex justify-center p-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg shadow-md space-x-2">
            <NavButton active={page === 'translator'} onClick={() => setPage('translator')}>
              Translator
            </NavButton>
            <NavButton active={page ==="password"} onClick={() => setPage('password')}>
              String Generator
            </NavButton>
          </nav>
        </header>

        <main>
          {/* Conditional rendering based on state */}
          {page === 'translator' && <Translator />}
          {page === 'password' && <PasswordGenerator />}
        </main>
        
        <footer className="mt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} - A React App fulfilling internship requirements.</p>
        </footer>
      </div>
    </div>
  );
}

