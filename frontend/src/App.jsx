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

  const askPrediction = async () => {
    if (!selectedZodiac) return;
    
    setLoading(true);
    setPrediction("");
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Be an extremely toxic, mystical, ironic, and sarcastic astrologer. Generate a short, mean (but funny) prediction/description for the zodiac ${selectedZodiac}. Use markdown formatting (lists, bold) where appropriate. Respond in English.`,
      });
      
      setPrediction(response.text);
    } catch (error) {
      console.error(error);
      setPrediction("The planets are badly aligned or you forgot to change the API key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div style={styles.pageWrapper}>
    <div style={styles.container}>
      <h1 style={styles.title}>🔮 Oracle 🔮</h1>
      <p style={styles.subtitle}>Discover the real truth about your zodiac.</p>
      <div style={styles.card}>
        <select 
          value={selectedZodiac} 
          onChange={(e) => setselectedZodiac(e.target.value)}
          style={styles.select}
        >
          <option value="">Choose your doomed zodiac...</option>
          {zodiac.map(z => <option key={z} value={z}>{z}</option>)}
        </select>

        <button 
          onClick={askPrediction} 
          disabled={loading || !selectedZodiac}
          style={styles.button}
        >
          {loading ? "Mixing the venom..." : "Get Toxic Horoscope"}
        </button>
      </div>

      {prediction && (
        <div style={styles.resultBox}>
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
    backgroundColor: '#0f0f1e',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: '20px',
    boxSizing: 'border-box'
  },
  container: { 
    maxWidth: '600px', 
    margin: '30px auto',
    padding: '20px', 
    textAlign: 'center', 
    fontFamily: 'Arial, sans-serif', 
    color: '#fff', 
    backgroundColor: '#1a1a2e', 
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
  },
  title: { color: '#e94560', marginBottom: '10px' },
  subtitle: { color: '#8a8a9e', marginBottom: '30px' },
  card: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #4e4e50', backgroundColor: '#161625', color: '#fff', outline: 'none' },
  button: { padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: '#e94560', color: '#fff', cursor: 'pointer', fontWeight: 'bold' },
  resultBox: { padding: '20px', backgroundColor: '#161625', borderRadius: '8px', borderLeft: '5px solid #e94560', textAlign: 'left', lineHeight: '1.6' }
};