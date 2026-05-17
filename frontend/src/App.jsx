import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// Inițializăm AI-ul cu cheia din .env
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const ZODII = [
  "Berbec", "Taur", "Gemeni", "Rac", "Leu", "Fecioară", 
  "Balanță", "Scorpion", "Săgetător", "Capricorn", "Vărsător", "Pești"
];

export default function App() {
  const [zodieSelectata, setZodieSelectata] = useState("");
  const [predictie, setPredictie] = useState("");
  const [loading, setLoading] = useState(false);

  const cerePredictia = async () => {
    if (!zodieSelectata) return;
    
    setLoading(true);
    setPredictie("");
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Fii un astrolog extrem de toxic, mistic, ironic și sarcastic. Generează o predicție/descriere scurtă și rea (dar amuzantă) pentru zodia ${zodieSelectata}. Folosește formatare markdown (liste, bold-uri) unde e cazul. Răspunde în română.`,
      });
      
      setPredictie(response.text);
    } catch (error) {
      console.error(error);
      setPredictie("Planetele sunt aliniate prost sau ai uitat să schimbi cheia de API. Mai încearcă.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div style={styles.pageWrapper}> {/* Wrapper-ul ăsta nou salvează situația */}
    <div style={styles.container}>
      <h1 style={styles.title}>🔮 Toxic Oracle 🔮</h1>
      <p style={styles.subtitle}>Află adevărul nuanțat despre zodia ta. Nu o să-ți placă.</p>

      <div style={styles.card}>
        <select 
          value={zodieSelectata} 
          onChange={(e) => setZodieSelectata(e.target.value)}
          style={styles.select}
        >
          <option value="">Alege-ți zodia pierzaniei...</option>
          {ZODII.map(z => <option key={z} value={z}>{z}</option>)}
        </select>

        <button 
          onClick={cerePredictia} 
          disabled={loading || !zodieSelectata}
          style={styles.button}
        >
          {loading ? "Se amestecă veninul..." : "Cere Horoscopul Toxic"}
        </button>
      </div>

      {predictie && (
        <div style={styles.resultBox}>
          <ReactMarkdown>{predictie}</ReactMarkdown>
        </div>
      )}
    </div>
  </div>
);
}

// Stiluri inline rapide ca să nu ne batem capul cu CSS acum
const styles = {
  // Ăsta o să coloreze TOT ecranul în închis, indiferent de rezoluție
  pageWrapper: {
    backgroundColor: '#0f0f1e', // Un pic mai închis decât cardul, ca să dea contrast
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: '20px',
    boxSizing: 'border-box'
  },
  container: { 
    maxWidth: '600px', 
    margin: '30px auto', // Am scăzut un pic margin-ul de sus
    padding: '20px', 
    textAlign: 'center', 
    fontFamily: 'Arial, sans-serif', 
    color: '#fff', 
    backgroundColor: '#1a1a2e', 
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)' // Un pic de umbră fină
  },
  // restul rămân la fel...
  title: { color: '#e94560', marginBottom: '10px' },
  subtitle: { color: '#8a8a9e', marginBottom: '30px' },
  card: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #4e4e50', backgroundColor: '#161625', color: '#fff', outline: 'none' },
  button: { padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: '#e94560', color: '#fff', cursor: 'pointer', fontWeight: 'bold' },
  resultBox: { padding: '20px', backgroundColor: '#161625', borderRadius: '8px', borderLeft: '5px solid #e94560', textAlign: 'left', lineHeight: '1.6' }
};