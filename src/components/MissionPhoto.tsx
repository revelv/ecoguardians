import { useState } from 'react';
import { playClick, playSuccess, playCoin } from '../utils/soundEffects';

interface MissionPhotoProps {
  onXpGain: (amount: number) => void;
}

const SAMPLE_SCENARIOS = [
  {
    id: 1,
    emoji: '🗑️',
    title: 'Sampah di Trotoar',
    description: 'Kamu menemukan tumpukan sampah plastik di trotoar dekat sekolah. Sampah berserakan sampai ke jalan!',
    image: '🚶‍♂️🗑️📦🥤🧃',
  },
  {
    id: 2,
    emoji: '🌊',
    title: 'Selokan Tersumbat',
    description: 'Selokan di depan rumahmu tersumbat oleh sampah plastik dan daun kering. Air tidak bisa mengalir dengan baik.',
    image: '💧🍂🥤🧴🌿',
  },
  {
    id: 3,
    emoji: '🏞️',
    title: 'Sungai Tercemar',
    description: 'Sungai di dekat taman bermain terlihat kotor dan berbau. Ada botol plastik dan bungkus makanan mengapung.',
    image: '🏞️🐟💀🥤📦',
  },
  {
    id: 4,
    emoji: '🏫',
    title: 'Halaman Sekolah Kotor',
    description: 'Setelah jam istirahat, halaman sekolah penuh dengan bungkus snack dan sedotan plastik yang dibuang sembarangan.',
    image: '🏫🍬🧃📦🍫',
  },
];

const REACTIONS = [
  { emoji: '😢', label: 'Sedih', color: '#29B6F6' },
  { emoji: '😠', label: 'Marah', color: '#FF5252' },
  { emoji: '😟', label: 'Khawatir', color: '#FF9800' },
  { emoji: '🤔', label: 'Bingung', color: '#AB47BC' },
  { emoji: '💪', label: 'Semangat!', color: '#4CAF50' },
];

const ACTION_SUGGESTIONS = [
  'Mengajak teman-teman membersihkan sampah bersama',
  'Melapor ke pak RT / guru agar segera ditangani',
  'Membuang sampah ke tempat yang benar',
  'Mengingatkan orang-orang untuk tidak buang sampah sembarangan',
  'Membuat poster tentang bahaya buang sampah sembarangan',
];

export default function MissionPhoto({ onXpGain }: MissionPhotoProps) {
  const [phase, setPhase] = useState<'camera' | 'scenario' | 'react' | 'reflect' | 'done'>('camera');
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');
  const [showFlash, setShowFlash] = useState(false);
  const [submissions, setSubmissions] = useState<Array<{
    scenario: number;
    reaction: number;
    reflection: string;
  }>>([]);

  const handleTakePhoto = (scenarioIndex: number) => {
    playClick();
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
      setSelectedScenario(scenarioIndex);
      setPhase('scenario');
    }, 500);
  };

  const handleReaction = (index: number) => {
    playClick();
    setSelectedReaction(index);
    setPhase('reflect');
  };

  const handleSubmitReflection = () => {
    if (selectedScenario === null || selectedReaction === null) return;
    playSuccess();
    playCoin();
    onXpGain(20);
    setSubmissions(prev => [...prev, {
      scenario: selectedScenario,
      reaction: selectedReaction,
      reflection: reflection || ACTION_SUGGESTIONS[0],
    }]);
    setPhase('done');
  };

  const handleReset = () => {
    playClick();
    setPhase('camera');
    setSelectedScenario(null);
    setSelectedReaction(null);
    setReflection('');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Flash overlay */}
      {showFlash && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#fff',
          zIndex: 9999,
          animation: 'fadeOut 0.5s ease forwards',
        }} />
      )}

      <h1 style={{ textAlign: 'center', color: 'var(--color-teal-dark)', marginBottom: '24px' }}>
        🔍 Misi Detektif Sampah
      </h1>

      {/* Phase: Camera - select scenario */}
      {phase === 'camera' && (
        <div>
          <div className="neo-card animate-slide-up" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '12px' }}>📸</div>
            <h2 style={{ color: 'var(--color-teal-dark)', marginBottom: '8px' }}>Jadi Detektif Lingkungan!</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Pilih salah satu skenario di bawah ini. Bayangkan kamu sedang melihatnya langsung di sekitarmu!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {SAMPLE_SCENARIOS.map((scenario, i) => (
              <div
                key={scenario.id}
                className="neo-card animate-slide-up"
                onClick={() => handleTakePhoto(i)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  animationDelay: `${i * 0.1}s`,
                  transition: 'transform 0.2s ease',
                }}
              >
                {/* Simulated photo */}
                <div style={{
                  background: 'linear-gradient(135deg, #e8f5e9, #b2dfdb)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  marginBottom: '12px',
                  fontSize: '2.5rem',
                  letterSpacing: '4px',
                  border: '2px solid var(--border-color)',
                }}>
                  {scenario.image}
                </div>
                <h3 style={{ marginBottom: '6px' }}>{scenario.emoji} {scenario.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{scenario.description}</p>
                <button className="neo-btn neo-btn-sky" style={{ marginTop: '12px', fontSize: '0.85rem' }}>
                  📷 Jepret!
                </button>
              </div>
            ))}
          </div>

          {/* Past submissions */}
          {submissions.length > 0 && (
            <div className="neo-card" style={{ marginTop: '24px' }}>
              <h3 style={{ marginBottom: '12px' }}>📋 Catatan Detektifmu ({submissions.length})</h3>
              {submissions.map((sub, i) => (
                <div key={i} style={{
                  padding: '10px',
                  background: '#f5f5f5',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '0.85rem',
                }}>
                  <strong>{SAMPLE_SCENARIOS[sub.scenario].emoji} {SAMPLE_SCENARIOS[sub.scenario].title}</strong>
                  <span style={{ marginLeft: '8px' }}>{REACTIONS[sub.reaction].emoji}</span>
                  <p style={{ marginTop: '4px', color: 'var(--color-text-secondary)' }}>{sub.reflection}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Phase: Scenario detail */}
      {phase === 'scenario' && selectedScenario !== null && (
        <div className="neo-card animate-bounce-in" style={{ textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            marginBottom: '20px',
            fontSize: '3.5rem',
            letterSpacing: '8px',
            border: '3px solid var(--border-color)',
            boxShadow: '4px 4px 0 var(--shadow-color)',
          }}>
            {SAMPLE_SCENARIOS[selectedScenario].image}
          </div>

          <h2 style={{ marginBottom: '12px' }}>
            {SAMPLE_SCENARIOS[selectedScenario].emoji} {SAMPLE_SCENARIOS[selectedScenario].title}
          </h2>
          <p style={{ marginBottom: '24px', fontSize: '1.05rem', lineHeight: '1.7' }}>
            {SAMPLE_SCENARIOS[selectedScenario].description}
          </p>

          <h3 style={{ marginBottom: '16px', color: 'var(--color-orange-dark)' }}>
            Apa perasaanmu melihat ini?
          </h3>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {REACTIONS.map((reaction, i) => (
              <button
                key={i}
                onClick={() => handleReaction(i)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: '3px solid var(--border-color)',
                  boxShadow: '4px 4px 0 var(--shadow-color)',
                  background: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '2.5rem',
                }}
              >
                {reaction.emoji}
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{reaction.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phase: Reflect */}
      {phase === 'reflect' && selectedReaction !== null && (
        <div className="neo-card animate-slide-up" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
            {REACTIONS[selectedReaction].emoji}
          </div>
          <h2 style={{ marginBottom: '8px', color: 'var(--color-teal-dark)' }}>
            Kamu merasa {REACTIONS[selectedReaction].label}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Bagus! Sekarang pikirkan, apa yang akan kamu lakukan?
          </p>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '12px', textAlign: 'left' }}>💡 Pilih atau tulis aksimu:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {ACTION_SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => { playClick(); setReflection(suggestion); }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: `3px solid ${reflection === suggestion ? 'var(--color-teal)' : 'var(--border-color)'}`,
                    background: reflection === suggestion ? 'var(--color-teal-light)' : '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: reflection === suggestion ? 700 : 500,
                    fontSize: '0.9rem',
                    transition: 'all 0.15s ease',
                    boxShadow: '3px 3px 0 var(--shadow-color)',
                  }}
                >
                  {reflection === suggestion ? '✅ ' : '○ '}{suggestion}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Atau tulis idemu sendiri di sini... ✍️"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '3px solid var(--border-color)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                resize: 'vertical',
                boxShadow: '3px 3px 0 var(--shadow-color)',
              }}
            />
          </div>

          <button
            className="neo-btn neo-btn-success"
            onClick={handleSubmitReflection}
            style={{ padding: '12px 32px', fontSize: '1.1rem' }}
          >
            ✅ Kirim Refleksi (+20 XP)
          </button>
        </div>
      )}

      {/* Phase: Done */}
      {phase === 'done' && (
        <div className="neo-card animate-bounce-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🌟</div>
          <h2 style={{ color: 'var(--color-green-dark)', marginBottom: '12px' }}>
            Keren! Misi Detektif Selesai!
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
            Kamu mendapat <strong style={{ color: 'var(--color-lemon-dark)' }}>+20 XP</strong>!
          </p>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Terima kasih sudah peduli pada lingkungan! Setiap aksi kecilmu sangat berarti. 🌍💚
          </p>
          <button className="neo-btn neo-btn-primary" onClick={handleReset} style={{ padding: '12px 28px' }}>
            🔄 Investigasi Lagi
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
