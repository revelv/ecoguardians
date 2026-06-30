import { useState, useEffect, useCallback, useRef } from 'react';
import { playClick, playSuccess, playError, playCoin, playLevelUp } from '../utils/soundEffects';

interface MissionGameProps {
  onXpGain: (amount: number) => void;
}

interface FallingTrash {
  id: number;
  type: 'organik' | 'anorganik' | 'b3';
  emoji: string;
  name: string;
  x: number;
  y: number;
  speed: number;
}

const TRASH_ITEMS: { emoji: string; name: string; type: 'organik' | 'anorganik' | 'b3' }[] = [
  { emoji: '🍌', name: 'Kulit Pisang', type: 'organik' },
  { emoji: '🍎', name: 'Sisa Apel', type: 'organik' },
  { emoji: '🥬', name: 'Sayur Busuk', type: 'organik' },
  { emoji: '🍂', name: 'Daun Kering', type: 'organik' },
  { emoji: '🌽', name: 'Tongkol Jagung', type: 'organik' },
  { emoji: '🥤', name: 'Gelas Plastik', type: 'anorganik' },
  { emoji: '🧴', name: 'Botol Shampo', type: 'anorganik' },
  { emoji: '📦', name: 'Kardus Bekas', type: 'anorganik' },
  { emoji: '👟', name: 'Sepatu Bekas', type: 'anorganik' },
  { emoji: '🥫', name: 'Kaleng Bekas', type: 'anorganik' },
  { emoji: '🔋', name: 'Baterai Bekas', type: 'b3' },
  { emoji: '💊', name: 'Obat Kedaluwarsa', type: 'b3' },
  { emoji: '🧪', name: 'Botol Kimia', type: 'b3' },
  { emoji: '💡', name: 'Lampu Neon', type: 'b3' },
];

const BIN_TYPES = [
  { type: 'organik' as const, emoji: '🟢', label: 'Organik', color: '#4CAF50', bgColor: '#E8F5E9' },
  { type: 'anorganik' as const, emoji: '🔵', label: 'Anorganik', color: '#29B6F6', bgColor: '#E3F2FD' },
  { type: 'b3' as const, emoji: '🔴', label: 'B3', color: '#FF5252', bgColor: '#FFEBEE' },
];

const GAME_WIDTH = 100; // percentage
const GAME_DURATION = 60; // seconds
const SPAWN_INTERVAL = 1500; // ms

export default function MissionGame({ onXpGain }: MissionGameProps) {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [fallingTrash, setFallingTrash] = useState<FallingTrash[]>([]);
  const [selectedBin, setSelectedBin] = useState<number>(1); // 0=organik, 1=anorganik, 2=b3
  const [combo, setCombo] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; x: number; y: number } | null>(null);
  const [highScore, setHighScore] = useState(0);

  const trashIdRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopGame = useCallback(() => {
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    gameLoopRef.current = null;
    spawnRef.current = null;
    timerRef.current = null;
  }, []);

  const endGame = useCallback(() => {
    stopGame();
    setGameState('gameover');
    setHighScore(prev => Math.max(prev, score));
    if (score > 0) {
      const xpEarned = Math.floor(score * 2);
      onXpGain(xpEarned);
      if (score >= 20) playLevelUp();
      else playSuccess();
    }
  }, [stopGame, score, onXpGain]);

  // Spawn new trash
  const spawnTrash = useCallback(() => {
    const item = TRASH_ITEMS[Math.floor(Math.random() * TRASH_ITEMS.length)];
    const newTrash: FallingTrash = {
      id: trashIdRef.current++,
      ...item,
      x: 10 + Math.random() * 80,
      y: 0,
      speed: 0.3 + Math.random() * 0.4,
    };
    setFallingTrash(prev => [...prev, newTrash]);
  }, []);

  // Handle bin selection
  const handleCatchTrash = useCallback((trashId: number, binType: 'organik' | 'anorganik' | 'b3') => {
    setFallingTrash(prev => {
      const trash = prev.find(t => t.id === trashId);
      if (!trash) return prev;

      if (trash.type === binType) {
        // Correct!
        playCoin();
        setScore(s => s + (10 + combo * 2));
        setCombo(c => c + 1);
        setShowFeedback({ correct: true, x: trash.x, y: trash.y });
      } else {
        // Wrong!
        playError();
        setLives(l => l - 1);
        setCombo(0);
        setShowFeedback({ correct: false, x: trash.x, y: trash.y });
      }

      setTimeout(() => setShowFeedback(null), 600);
      return prev.filter(t => t.id !== trashId);
    });
  }, [combo]);

  // Game loop — move trash down
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      setFallingTrash(prev => {
        const updated = prev.map(t => ({
          ...t,
          y: t.y + t.speed * delta * 0.05,
        }));

        // Check for missed trash (fell past the bottom)
        const missed = updated.filter(t => t.y >= 100);
        if (missed.length > 0) {
          setLives(l => l - missed.length);
          setCombo(0);
          playError();
        }

        return updated.filter(t => t.y < 100);
      });

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState]);

  // Spawn timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnTrash();
    spawnRef.current = window.setInterval(spawnTrash, SPAWN_INTERVAL);

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameState, spawnTrash]);

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) return 0;
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // End game on time up or lives out
  useEffect(() => {
    if (gameState === 'playing' && (timeLeft <= 0 || lives <= 0)) {
      endGame();
    }
  }, [timeLeft, lives, gameState, endGame]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setSelectedBin(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setSelectedBin(prev => Math.min(2, prev + 1));
      } else if (e.key === ' ' || e.key === 'Enter') {
        // Catch nearest trash
        setFallingTrash(prev => {
          const nearest = prev.reduce<FallingTrash | null>((closest, t) => {
            if (!closest) return t;
            return t.y > closest.y ? t : closest;
          }, null);

          if (nearest && nearest.y > 50) {
            handleCatchTrash(nearest.id, BIN_TYPES[selectedBin].type);
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, selectedBin, handleCatchTrash]);

  const startGame = () => {
    playClick();
    setGameState('playing');
    setScore(0);
    setLives(3);
    setTimeLeft(GAME_DURATION);
    setFallingTrash([]);
    setCombo(0);
    trashIdRef.current = 0;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: 'var(--color-teal-dark)', marginBottom: '24px' }}>
        🎮 Game Pilah Sampah
      </h1>

      {/* Menu */}
      {gameState === 'menu' && (
        <div className="neo-card animate-bounce-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '16px' }}>♻️</div>
          <h2 style={{ marginBottom: '12px', color: 'var(--color-green-dark)' }}>Ayo Main Pilah Sampah!</h2>
          <p style={{ marginBottom: '8px', fontSize: '1rem', lineHeight: '1.7' }}>
            Sampah akan jatuh dari atas. Tugasmu adalah memasukkan sampah ke tong yang benar!
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '24px 0', flexWrap: 'wrap' }}>
            {BIN_TYPES.map((bin) => (
              <div
                key={bin.type}
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: '3px solid var(--border-color)',
                  background: bin.bgColor,
                  textAlign: 'center',
                  boxShadow: '3px 3px 0 var(--shadow-color)',
                }}
              >
                <div style={{ fontSize: '2rem' }}>{bin.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: bin.color }}>{bin.label}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#FFF9C4',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--border-color)',
            marginBottom: '24px',
            textAlign: 'left',
            fontSize: '0.9rem',
          }}>
            <strong>🎯 Cara Main:</strong>
            <ul style={{ marginTop: '8px', paddingLeft: '16px', listStyle: 'disc' }}>
              <li>Klik sampah yang jatuh, lalu pilih tong yang benar</li>
              <li>Atau gunakan ← → untuk pilih tong, lalu tekan Spasi untuk tangkap</li>
              <li>Jangan sampai sampah jatuh ke tanah! ❤️ = nyawa</li>
              <li>Combo berturut-turut = bonus poin! 🔥</li>
            </ul>
          </div>

          {highScore > 0 && (
            <p style={{ marginBottom: '16px', color: 'var(--color-lemon-dark)', fontWeight: 700 }}>
              🏆 Skor Tertinggi: {highScore}
            </p>
          )}

          <button
            className="neo-btn neo-btn-success"
            onClick={startGame}
            style={{ padding: '14px 40px', fontSize: '1.2rem' }}
          >
            🚀 Mulai Main!
          </button>
        </div>
      )}

      {/* Playing */}
      {gameState === 'playing' && (
        <div>
          {/* HUD */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <span className="badge badge-lemon" style={{ fontSize: '0.85rem' }}>⭐ Skor: {score}</span>
            <span className="badge badge-coral" style={{ fontSize: '0.85rem' }}>
              {'❤️'.repeat(Math.max(0, lives))}{'🖤'.repeat(Math.max(0, 3 - lives))}
            </span>
            {combo >= 3 && (
              <span className="badge badge-orange animate-pulse" style={{ fontSize: '0.85rem' }}>
                🔥 Combo x{combo}!
              </span>
            )}
            <span className="badge badge-sky" style={{ fontSize: '0.85rem' }}>⏱️ {timeLeft}s</span>
          </div>

          {/* Game area */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 70%, #8B4513 85%, #654321 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '4px solid var(--border-color)',
              boxShadow: '6px 6px 0 var(--shadow-color)',
              overflow: 'hidden',
              userSelect: 'none',
            }}
          >
            {/* Clouds */}
            <div style={{ position: 'absolute', top: '10px', left: '10%', fontSize: '2rem', opacity: 0.6 }}>☁️</div>
            <div style={{ position: 'absolute', top: '25px', right: '15%', fontSize: '1.5rem', opacity: 0.5 }}>☁️</div>
            <div style={{ position: 'absolute', top: '5px', left: '50%', fontSize: '1.8rem', opacity: 0.4 }}>☁️</div>

            {/* Trees */}
            <div style={{ position: 'absolute', bottom: '60px', left: '5%', fontSize: '2.5rem' }}>🌳</div>
            <div style={{ position: 'absolute', bottom: '60px', right: '8%', fontSize: '2rem' }}>🌲</div>

            {/* Falling trash */}
            {fallingTrash.map(trash => (
              <div
                key={trash.id}
                onClick={() => handleCatchTrash(trash.id, BIN_TYPES[selectedBin].type)}
                style={{
                  position: 'absolute',
                  left: `${trash.x}%`,
                  top: `${trash.y}%`,
                  fontSize: '2.2rem',
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease',
                  filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
                  zIndex: 5,
                }}
                title={`${trash.name} (${trash.type})`}
              >
                {trash.emoji}
              </div>
            ))}

            {/* Feedback popup */}
            {showFeedback && (
              <div
                className="animate-pop-in"
                style={{
                  position: 'absolute',
                  left: `${showFeedback.x}%`,
                  top: `${showFeedback.y}%`,
                  fontSize: '2rem',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                {showFeedback.correct ? '✅' : '❌'}
              </div>
            )}

            {/* Bins at the bottom */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              padding: '10px',
              background: 'rgba(139,69,19,0.5)',
              zIndex: 6,
            }}>
              {BIN_TYPES.map((bin, i) => (
                <button
                  key={bin.type}
                  onClick={() => { playClick(); setSelectedBin(i); }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: `3px solid ${i === selectedBin ? '#FFD700' : 'var(--border-color)'}`,
                    background: i === selectedBin ? bin.color : bin.bgColor,
                    color: i === selectedBin ? '#fff' : bin.color,
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: i === selectedBin ? '0 0 12px rgba(255,215,0,0.6)' : '2px 2px 0 var(--shadow-color)',
                    transition: 'all 0.15s ease',
                    transform: i === selectedBin ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>🗑️</span>
                  <div style={{ fontSize: '0.75rem' }}>{bin.emoji} {bin.label}</div>
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            💡 Klik sampah untuk menangkap, atau ← → + Spasi. Pilih tong yang benar!
          </p>
        </div>
      )}

      {/* Game Over */}
      {gameState === 'gameover' && (
        <div className="neo-card animate-bounce-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '16px' }}>
            {score >= 100 ? '🏆' : score >= 50 ? '🌟' : score >= 20 ? '💪' : '🌱'}
          </div>
          <h2 style={{ marginBottom: '8px', color: 'var(--color-teal-dark)' }}>
            {score >= 100 ? 'Luar Biasa! Kamu Master Pilah!' : score >= 50 ? 'Hebat! Terus Berlatih!' : score >= 20 ? 'Bagus! Kamu Bisa Lebih Baik!' : 'Ayo Coba Lagi!'}
          </h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-lemon-dark)', marginBottom: '8px' }}>
            {score} Poin
          </div>
          <p style={{ marginBottom: '24px', color: 'var(--color-text-secondary)' }}>
            XP didapat: <strong style={{ color: 'var(--color-green)' }}>+{Math.floor(score * 2)} XP</strong>
          </p>

          {/* Stars */}
          <div style={{ fontSize: '2.5rem', marginBottom: '24px', letterSpacing: '8px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ opacity: i < Math.min(5, Math.ceil(score / 25)) ? 1 : 0.2 }}>⭐</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="neo-btn neo-btn-success" onClick={startGame} style={{ padding: '12px 28px' }}>
              🔄 Main Lagi
            </button>
            <button className="neo-btn neo-btn-primary" onClick={() => setGameState('menu')} style={{ padding: '12px 28px' }}>
              🏠 Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
