import { useState, useCallback, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MissionQuiz from './components/MissionQuiz';
import MissionPhoto from './components/MissionPhoto';
import MissionGame from './components/MissionGame';
import PetCare from './components/PetCare';
import Leaderboard from './components/Leaderboard';
import { playClick } from './utils/soundEffects';
import ecoPetImg from './assets/eco_pet.png';
import { supabase } from './createClient';

type Page = 'dashboard' | 'quiz' | 'photo' | 'game' | 'pet' | 'leaderboard';

const NAV_ITEMS: { id: Page; label: string; emoji: string; color: string }[] = [
  { id: 'dashboard', label: 'Dashboard', emoji: '🏠', color: '#00BFA6' },
  { id: 'quiz', label: 'Belajar & Kuis', emoji: '📚', color: '#29B6F6' },
  { id: 'photo', label: 'Detektif Sampah', emoji: '🔍', color: '#FF9800' },
  { id: 'game', label: 'Game Pilah', emoji: '🎮', color: '#4CAF50' },
  { id: 'pet', label: 'Asuh Pet', emoji: '🐾', color: '#AB47BC' },
  { id: 'leaderboard', label: 'Papan Skor', emoji: '🏆', color: '#FDD835' },
];

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(2);
  const [petLevel, setPetLevel] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const petName = 'Piko';

  // Efek untuk mengetes/menjalankan koneksi database di background
  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('modules').select('id').limit(1);
        if (error) {
          console.error('[Supabase] Koneksi gagal:', error.message);
        } else {
          console.log('[Supabase] Koneksi sukses! Berhasil terhubung ke database Supabase.');
        }
      } catch (err) {
        console.error('[Supabase] Error saat mencoba koneksi:', err);
      }
    }
    testConnection();
  }, []);

  const handleXpGain = useCallback((amount: number) => {
    setXp(prev => {
      const newXp = prev + amount;
      const xpNeeded = level * 100;
      if (newXp >= xpNeeded) {
        setLevel(l => l + 1);
      }
      return newXp;
    });
  }, [level]);

  const handlePetLevelUp = useCallback(() => {
    setPetLevel(prev => prev + 1);
  }, []);

  const navigateTo = (page: Page) => {
    playClick();
    setActivePage(page);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard xp={xp} level={level} petName={petName} />;
      case 'quiz':
        return <MissionQuiz onXpGain={handleXpGain} />;
      case 'photo':
        return <MissionPhoto onXpGain={handleXpGain} />;
      case 'game':
        return <MissionGame onXpGain={handleXpGain} />;
      case 'pet':
        return <PetCare petName={petName} petLevel={petLevel} onPetLevelUp={handlePetLevelUp} />;
      case 'leaderboard':
        return <Leaderboard playerXp={xp} playerLevel={level} />;
      default:
        return <Dashboard xp={xp} level={level} petName={petName} />;
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '240px' : '68px',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #004D40, #00695C, #00897B)',
          borderRight: '4px solid var(--border-color)',
          boxShadow: '6px 0 0 var(--shadow-color)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: sidebarOpen ? '20px 16px' : '20px 8px',
            borderBottom: '3px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            transition: 'padding 0.3s ease',
          }}
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          <img
            src={ecoPetImg}
            alt="Eco Guardians"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border: '2px solid #FFD700',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
          {sidebarOpen && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.1rem',
                color: '#fff',
                lineHeight: 1.2,
              }}>
                Eco Guardians
              </div>
              <div style={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 600,
              }}>
                🌍 Penyelamat Bumi Cilik
              </div>
            </div>
          )}
        </div>

        {/* Player mini card */}
        {sidebarOpen && (
          <div style={{
            margin: '12px 12px 0',
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-md)',
            border: '2px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.5rem' }}>🎖️</span>
              <div>
                <div style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.75rem' }}>Level {level}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem' }}>{xp} XP</div>
              </div>
            </div>
            <div style={{
              height: '6px',
              borderRadius: '3px',
              background: 'rgba(255,255,255,0.2)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min((xp / (level * 100)) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #FFD700, #FFA000)',
                borderRadius: '3px',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: sidebarOpen ? '10px 14px' : '10px 0',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                  background: isActive
                    ? 'rgba(255,255,255,0.18)'
                    : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    borderRadius: '0 4px 4px 0',
                    background: item.color,
                  }} />
                )}
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.emoji}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Pet status in sidebar footer */}
        <div style={{
          padding: '12px',
          borderTop: '2px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
        }}>
          <button
            onClick={() => navigateTo('pet')}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '2px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-md)',
              padding: sidebarOpen ? '8px 12px' : '8px',
              width: '100%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              color: '#fff',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <span style={{ fontSize: '1.4rem' }} className="animate-float">🐾</span>
            {sidebarOpen && (
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{petName}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>Lv.{petLevel}</div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          minHeight: '100vh',
          overflowY: 'auto',
          background: 'var(--color-bg)',
        }}
      >
        {/* Top bar */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            padding: '10px 24px',
            background: 'rgba(240, 255, 244, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '3px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>
              {NAV_ITEMS.find(n => n.id === activePage)?.emoji}
            </span>
            <h2 style={{
              fontSize: '1.2rem',
              color: 'var(--color-teal-dark)',
              fontFamily: 'var(--font-heading)',
            }}>
              {NAV_ITEMS.find(n => n.id === activePage)?.label}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="badge badge-lemon">⚡ {xp} XP</span>
            <span className="badge badge-teal">🎖️ Lv.{level}</span>
          </div>
        </header>

        {/* Page Content */}
        <div key={activePage} className="animate-slide-up">
          {renderContent()}
        </div>
      </main>
    </>
  );
}
