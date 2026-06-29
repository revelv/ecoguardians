import { useState } from 'react';
import { playClick, playFeed, playSplash, playSuccess, playLevelUp } from '../utils/soundEffects';
import ecoPetImg from '../assets/eco_pet.png';

interface PetCareProps {
  petName: string;
  petLevel: number;
  onPetLevelUp: () => void;
}

interface PetStats {
  hunger: number;     // 0-100
  cleanliness: number; // 0-100
  happiness: number;  // 0-100
}

const PET_EVOLUTION = [
  { level: 1, title: 'Bibit Eco 🌱', color: '#A5D6A7' },
  { level: 3, title: 'Tunas Hijau 🌿', color: '#66BB6A' },
  { level: 5, title: 'Penjaga Kecil 🌳', color: '#43A047' },
  { level: 8, title: 'Eco Warrior 🛡️', color: '#2E7D32' },
  { level: 10, title: 'Guardian Legendaris 🌟', color: '#1B5E20' },
  { level: 15, title: 'Dewa Alam 👑', color: '#FFD700' },
];

export default function PetCare({ petName, petLevel, onPetLevelUp }: PetCareProps) {
  const [stats, setStats] = useState<PetStats>({
    hunger: 50,
    cleanliness: 50,
    happiness: 50,
  });
  const [animatingAction, setAnimatingAction] = useState<string | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [lastMessage, setLastMessage] = useState('Halo! Aku siap menemanimu menjaga Bumi! 🌍');

  const currentEvolution = PET_EVOLUTION.reduce((prev, curr) =>
    petLevel >= curr.level ? curr : prev
  , PET_EVOLUTION[0]);

  const averageStat = Math.round((stats.hunger + stats.cleanliness + stats.happiness) / 3);

  const getPetMood = () => {
    if (averageStat >= 80) return '😊';
    if (averageStat >= 60) return '🙂';
    if (averageStat >= 40) return '😐';
    if (averageStat >= 20) return '😟';
    return '😢';
  };

  const triggerAction = (action: string) => {
    setAnimatingAction(action);
    setTimeout(() => setAnimatingAction(null), 800);
  };

  const checkLevelUp = (newStats: PetStats) => {
    if (newStats.hunger >= 90 && newStats.cleanliness >= 90 && newStats.happiness >= 90) {
      playLevelUp();
      onPetLevelUp();
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      // Reset stats slightly after level up
      setStats({ hunger: 60, cleanliness: 60, happiness: 60 });
      setLastMessage(`🎉 NAIK LEVEL! ${petName} sekarang Level ${petLevel + 1}! Keren banget!`);
    }
  };

  const handleFeed = () => {
    playClick();
    playFeed();
    triggerAction('feed');
    const newStats = {
      ...stats,
      hunger: Math.min(100, stats.hunger + 20),
      happiness: Math.min(100, stats.happiness + 5),
    };
    setStats(newStats);
    setLastMessage('Nyam nyam! Terima kasih makanannya! 🍎');
    checkLevelUp(newStats);
  };

  const handleClean = () => {
    playClick();
    playSplash();
    triggerAction('clean');
    const newStats = {
      ...stats,
      cleanliness: Math.min(100, stats.cleanliness + 25),
      happiness: Math.min(100, stats.happiness + 5),
    };
    setStats(newStats);
    setLastMessage('Segar sekali! Sekarang aku bersih! 🚿✨');
    checkLevelUp(newStats);
  };

  const handlePlay = () => {
    playClick();
    playSuccess();
    triggerAction('play');
    const newStats = {
      ...stats,
      happiness: Math.min(100, stats.happiness + 25),
      hunger: Math.max(0, stats.hunger - 5),
    };
    setStats(newStats);
    setLastMessage('Yeay! Main bola seru sekali! ⚽🎾');
    checkLevelUp(newStats);
  };

  const renderStatBar = (label: string, value: number, emoji: string, colorClass: string) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{emoji} {label}</span>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: value >= 70 ? 'var(--color-green)' : value >= 40 ? 'var(--color-orange)' : 'var(--color-coral)' }}>
          {value}%
        </span>
      </div>
      <div className={`progress-bar ${colorClass}`}>
        <div className="progress-bar-fill" style={{ width: `${value}%` }}>
          <span>{value >= 20 ? `${value}%` : ''}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Level up celebration */}
      {showLevelUp && (
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                background: ['#FF5252', '#FDD835', '#4CAF50', '#29B6F6', '#AB47BC', '#FF9800'][i % 6],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                borderRadius: i % 3 === 0 ? '50%' : '2px',
                width: `${8 + Math.random() * 10}px`,
                height: `${8 + Math.random() * 10}px`,
              }}
            />
          ))}
        </div>
      )}

      <h1 style={{ textAlign: 'center', color: 'var(--color-teal-dark)', marginBottom: '24px' }}>
        🐾 Asuh Pet — {petName}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Pet Display */}
        <div className="neo-card animate-slide-up" style={{ textAlign: 'center' }}>
          {/* Evolution badge */}
          <div className="badge" style={{
            background: currentEvolution.color,
            color: '#fff',
            marginBottom: '16px',
            fontSize: '0.8rem',
          }}>
            {currentEvolution.title}
          </div>

          {/* Pet image */}
          <div
            className={animatingAction ? 'animate-wiggle' : 'animate-float'}
            style={{
              margin: '0 auto 16px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${currentEvolution.color}40, ${currentEvolution.color}20)`,
              border: '4px solid var(--border-color)',
              boxShadow: '4px 4px 0 var(--shadow-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={ecoPetImg}
              alt={petName}
              style={{
                width: '140px',
                height: '140px',
                objectFit: 'contain',
                filter: animatingAction === 'clean' ? 'brightness(1.2)' : 'none',
              }}
            />
            {/* Action overlay emoji */}
            {animatingAction && (
              <div className="animate-pop-in" style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '2rem',
              }}>
                {animatingAction === 'feed' ? '🍎' : animatingAction === 'clean' ? '💧' : '⚽'}
              </div>
            )}
          </div>

          {/* Mood */}
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{getPetMood()}</div>
          <h2 style={{ marginBottom: '4px' }}>{petName}</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>
            Level {petLevel} • {currentEvolution.title}
          </p>

          {/* Speech bubble */}
          <div style={{
            background: '#f5f5f5',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid #e0e0e0',
            marginTop: '12px',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            position: 'relative',
          }}>
            💬 "{lastMessage}"
          </div>
        </div>

        {/* Right: Stats & Actions */}
        <div>
          {/* Stats */}
          <div className="neo-card animate-slide-up" style={{ marginBottom: '20px', animationDelay: '0.1s' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--color-teal-dark)' }}>📊 Status {petName}</h3>
            {renderStatBar('Kenyang', stats.hunger, '🍎', 'progress-green')}
            {renderStatBar('Kebersihan', stats.cleanliness, '🚿', 'progress-sky')}
            {renderStatBar('Kebahagiaan', stats.happiness, '💖', 'progress-coral')}

            <div style={{
              marginTop: '16px',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: averageStat >= 70 ? '#E8F5E9' : averageStat >= 40 ? '#FFF3E0' : '#FFEBEE',
              border: `2px solid ${averageStat >= 70 ? 'var(--color-green)' : averageStat >= 40 ? 'var(--color-orange)' : 'var(--color-coral)'}`,
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}>
              {averageStat >= 90
                ? '🌟 Semua status penuh! Siap naik level!'
                : averageStat >= 70
                ? '😊 Status bagus! Terus rawat ya!'
                : averageStat >= 40
                ? '😐 Perlu perhatian lebih...'
                : '😟 Yuk rawat petmu segera!'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="neo-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--color-orange-dark)' }}>🎮 Aksi Perawatan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="neo-btn neo-btn-success"
                onClick={handleFeed}
                style={{ padding: '14px 20px', fontSize: '1rem', width: '100%', justifyContent: 'flex-start' }}
              >
                <span style={{ fontSize: '1.5rem' }}>🍎</span>
                <div style={{ textAlign: 'left' }}>
                  <div>Beri Makan</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Kenyang +20, Senang +5</div>
                </div>
              </button>

              <button
                className="neo-btn neo-btn-sky"
                onClick={handleClean}
                style={{ padding: '14px 20px', fontSize: '1rem', width: '100%', justifyContent: 'flex-start' }}
              >
                <span style={{ fontSize: '1.5rem' }}>🚿</span>
                <div style={{ textAlign: 'left' }}>
                  <div>Mandikan</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Bersih +25, Senang +5</div>
                </div>
              </button>

              <button
                className="neo-btn neo-btn-orange"
                onClick={handlePlay}
                style={{ padding: '14px 20px', fontSize: '1rem', width: '100%', justifyContent: 'flex-start' }}
              >
                <span style={{ fontSize: '1.5rem' }}>⚽</span>
                <div style={{ textAlign: 'left' }}>
                  <div>Ajak Bermain</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Senang +25, Lapar -5</div>
                </div>
              </button>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '10px',
              background: '#FFF9C4',
              borderRadius: 'var(--radius-sm)',
              border: '2px solid #F9A825',
              fontSize: '0.8rem',
              color: '#F57F17',
            }}>
              💡 <strong>Tips:</strong> Isi semua status hingga 90%+ untuk naik level! Setiap level membuat {petName} berubah wujud menjadi lebih keren!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
