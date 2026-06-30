import { useState } from 'react';
import { playClick, playCoin } from '../utils/soundEffects';

interface DashboardProps {
  xp: number;
  level: number;
  petName: string;
}

const DAILY_CHECKINS = [
  { day: 'Sen', emoji: '🌱', bonus: 10 },
  { day: 'Sel', emoji: '🌿', bonus: 10 },
  { day: 'Rab', emoji: '🌳', bonus: 15 },
  { day: 'Kam', emoji: '🌻', bonus: 15 },
  { day: 'Jum', emoji: '🌍', bonus: 20 },
  { day: 'Sab', emoji: '🏆', bonus: 25 },
  { day: 'Min', emoji: '⭐', bonus: 30 },
];

const BADGES = [
  { name: 'Pemula Hijau', emoji: '🌱', unlockLevel: 1, desc: 'Memulai petualangan eco!' },
  { name: 'Penjaga Sungai', emoji: '🏞️', unlockLevel: 3, desc: 'Selesaikan 3 kuis tentang air' },
  { name: 'Detektif Sampah', emoji: '🔍', unlockLevel: 5, desc: 'Ambil 5 foto lingkungan' },
  { name: 'Master Pilah', emoji: '♻️', unlockLevel: 7, desc: 'Menang game pilah 3 kali' },
  { name: 'Eco Champion', emoji: '🏅', unlockLevel: 10, desc: 'Capai level 10!' },
  { name: 'Legenda Bumi', emoji: '🌟', unlockLevel: 15, desc: 'Capai level 15!' },
];

export default function Dashboard({ xp, level, petName }: DashboardProps) {
  const [checkedDays, setCheckedDays] = useState<number[]>([]);
  const [showBadgeInfo, setShowBadgeInfo] = useState<number | null>(null);

  const xpForNextLevel = level * 100;
  const xpProgress = Math.min((xp / xpForNextLevel) * 100, 100);

  const handleCheckin = (index: number) => {
    if (checkedDays.includes(index)) return;
    playClick();
    setTimeout(() => playCoin(), 200);
    setCheckedDays(prev => [...prev, index]);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-teal-dark)' }}>
          🌍 Dashboard Eco Guardian
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', marginTop: '4px' }}>
          Selamat datang, Pejuang Bumi! Ayo jaga lingkungan bersama {petName}!
        </p>
      </div>

      {/* Status Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Level Card */}
        <div className="neo-card animate-slide-up" style={{ background: 'linear-gradient(135deg, #E0F7FA, #B2DFDB)', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '3rem' }}>🎖️</span>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>LEVEL</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-teal-dark)', fontFamily: 'var(--font-heading)' }}>{level}</div>
            </div>
          </div>
          <div className="progress-bar progress-teal">
            <div className="progress-bar-fill" style={{ width: `${xpProgress}%` }}>
              <span>{xp}/{xpForNextLevel} XP</span>
            </div>
          </div>
        </div>

        {/* XP Card */}
        <div className="neo-card animate-slide-up" style={{ background: 'linear-gradient(135deg, #FFF9C4, #FFE082)', animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '3rem' }}>⚡</span>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>TOTAL XP</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F57F17', fontFamily: 'var(--font-heading)' }}>{xp}</div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            Kerjakan misi untuk dapat XP! 🚀
          </p>
        </div>

        {/* Pet Status Mini Card */}
        <div className="neo-card animate-slide-up" style={{ background: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '3rem' }} className="animate-float">🐾</span>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>PET</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-purple-dark)', fontFamily: 'var(--font-heading)' }}>{petName}</div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            Jangan lupa rawat pet-mu! 💜
          </p>
        </div>
      </div>

      {/* Daily Check-in */}
      <div className="neo-card animate-slide-up" style={{ marginBottom: '28px', animationDelay: '0.4s' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--color-green-dark)' }}>📅 Check-in Harian</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Klik setiap hari untuk klaim bonus XP!
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {DAILY_CHECKINS.map((day, i) => {
            const checked = checkedDays.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleCheckin(i)}
                className={checked ? 'animate-pop-in' : ''}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '3px solid var(--border-color)',
                  boxShadow: checked ? '3px 3px 0 var(--shadow-color)' : '4px 4px 0 var(--shadow-color)',
                  background: checked
                    ? 'linear-gradient(135deg, var(--color-green), #8BC34A)'
                    : '#fff',
                  color: checked ? '#fff' : 'var(--color-text)',
                  transition: 'all 0.2s ease',
                  cursor: checked ? 'default' : 'pointer',
                  minWidth: '70px',
                  transform: checked ? 'translate(1px, 1px)' : 'none',
                }}
              >
                <span style={{ fontSize: '1.6rem' }}>{day.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{day.day}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>+{day.bonus} XP</span>
                {checked && <span style={{ fontSize: '1rem' }}>✅</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="neo-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--color-orange-dark)' }}>🏅 Koleksi Lencana</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
          {BADGES.map((badge, i) => {
            const unlocked = level >= badge.unlockLevel;
            return (
              <div
                key={i}
                onClick={() => { playClick(); setShowBadgeInfo(showBadgeInfo === i ? null : i); }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '16px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border-color)',
                  background: unlocked ? '#FFF9C4' : '#f5f5f5',
                  opacity: unlocked ? 1 : 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  filter: unlocked ? 'none' : 'grayscale(0.8)',
                }}
              >
                <span style={{ fontSize: '2.2rem' }}>{badge.emoji}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center' }}>{badge.name}</span>
                {!unlocked && (
                  <span style={{ fontSize: '0.65rem', color: '#999' }}>🔒 Lv.{badge.unlockLevel}</span>
                )}
                {showBadgeInfo === i && (
                  <div style={{
                    position: 'absolute',
                    bottom: '105%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1a1a1a',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                  }}>
                    {badge.desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
