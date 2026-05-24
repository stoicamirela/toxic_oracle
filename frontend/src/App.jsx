import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// Initalizing the Google GenAI client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const zodiac = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export default function App() {
  const [selectedZodiac, setselectedZodiac] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [isToxic, setIsToxic] = useState(true); // State to toggle between Toxic and Positive mode

  const askPrediction = async () => {
    if (!selectedZodiac) return;
    
    setLoading(true);
    setPrediction("");

    // Dynamic prompts based on the selected mode
    const promptToxic = `Be an extremely toxic, mystical, ironic, and sarcastic astrologer. Generate a short, mean (but funny) prediction/description for the zodiac ${selectedZodiac}. Use markdown formatting (lists, bold) where appropriate. Respond in English.`;
    const promptPositive = `Be an uplifting, wise, compassionate, and highly motivational spiritual astrologer. Generate a short, inspiring, and beautiful weekly prediction full of good vibes for the zodiac ${selectedZodiac}. Focus on personal growth and positive energy. Use markdown formatting. Respond in English.`;
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: isToxic ? promptToxic : promptPositive,
      });
      
      setPrediction(response.text);
    } catch (error) {
      console.error(error);
      setPrediction("The planets are badly aligned or you forgot to change the API key. Please try again.");
    } finally {
      loading(false);
    }
  };

  return (
    <div style={{ ...styles.pageWrapper, backgroundColor: isToxic ? '#0f0f1e' : '#1a1c2e' }}>
      
      {/* Toggle Button Container */}
      <div style={styles.toggleContainer}>
        <button 
          onClick={() => {
            setIsToxic(!isToxic);
            setPrediction(""); // Clear previous prediction when switching vibes
          }}
          style={{
            ...styles.toggleButton,
            backgroundColor: isToxic ? '#3f3f5c' : '#ffb0d7',
            color: isToxic ? '#fff' : '#0f0f1e'
          }}
        >
          {isToxic ? "✨ Switch to Positive Oracle" : "🖤 Switch to Toxic Oracle"}
        </button>
      </div>

      <div style={{ ...styles.container, backgroundColor: isToxic ? '#1a1a2e' : '#242745' }}>
        <h1 style={{ ...styles.title, color: isToxic ? '#e94560' : '#ffb0d7' }}>
          {isToxic ? "🔮 Toxic Oracle 🔮" : "🌟 Positive Oracle 🌟"}
        </h1>
        <p style={styles.subtitle}>
          {isToxic ? "Discover the real, unfiltered truth about your zodiac." : "Align with the universe and receive your weekly blessing."}
        </p>

        <div style={styles.card}>
          <select 
            value={selectedZodiac} 
            onChange={(e) => setselectedZodiac(e.target.value)}
            style={{ ...styles.select, backgroundColor: isToxic ? '#161625' : '#1f213a' }}
          >
            <option value="">
              {isToxic ? "Choose your doomed zodiac..." : "Select your star sign..."}
            </option>
            {zodiac.map(z => <option key={z} value={z}>{z}</option>)}
          </select>

          <button 
            onClick={askPrediction} 
            disabled={loading || !selectedZodiac}
            style={{ 
              ...styles.button, 
              backgroundColor: isToxic ? '#e94560' : '#ffb0d7',
              color: isToxic ? '#fff' : '#0f0f1e'
            }}
          >
            {loading 
              ? (isToxic ? "Mixing the venom..." : "Reading the stars...") 
              : (isToxic ? "Get Toxic Horoscope" : "Receive Blessings")
            }
          </button>
        </div>

        {prediction && (
          <div style={{ 
            ...styles.resultBox, 
            backgroundColor: isToxic ? '#161625' : '#1f213a',
            borderLeftColor: isToxic ? '#e94560' : '#ffb0d7' 
          }}>
            <ReactMarkdown>{prediction}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: '20px',
    boxSizing: 'border-box',
    transition: 'background-color 0.4s ease'
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px'
  },
  toggleButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  container: { 
    maxWidth: '600px', 
    margin: '20px auto',
    padding: '20px', 
    textAlign: 'center', 
    fontFamily: 'Arial, sans-serif', 
    color: '#fff', 
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    transition: 'background-color 0.4s ease'
  },
  title: { marginBottom: '10px', transition: 'color 0.4s ease' },
  subtitle: { color: '#8a8a9e', marginBottom: '30px' },
  card: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #4e4e50', color: '#fff', outline: 'none', transition: 'background-color 0.4s ease' },
  button: { padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.4s ease' },
  resultBox: { padding: '20px', borderRadius: '8px', borderLeftStyle: 'solid', borderLeftWidth: '5px', textAlign: 'left', lineHeight: '1.6', transition: 'all 0.4s ease' }
};