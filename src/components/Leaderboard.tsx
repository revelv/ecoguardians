import { useState } from 'react';
import { playClick } from '../utils/soundEffects';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Budi Eco', xp: 15200, level: 15, avatar: '🦸', badge: '👑' },
  { rank: 2, name: 'Siti Green', xp: 13800, level: 14, avatar: '🦸‍♀️', badge: '🥈' },
  { rank: 3, name: 'Andi Nature', xp: 12400, level: 13, avatar: '🧑‍🔬', badge: '🥉' },
  { rank: 4, name: 'Dewi Earth', xp: 11000, level: 12, avatar: '👧', badge: '' },
  { rank: 5, name: 'Riko Hijau', xp: 9800, level: 11, avatar: '👦', badge: '' },
  { rank: 6, name: 'Maya Bumi', xp: 8500, level: 10, avatar: '👩', badge: '' },
  { rank: 7, name: 'Fajar Eco', xp: 7200, level: 9, avatar: '🧒', badge: '' },
  { rank: 8, name: 'Lina Forest', xp: 6100, level: 8, avatar: '👧', badge: '' },
  { rank: 9, name: 'Dimas Air', xp: 5400, level: 7, avatar: '👦', badge: '' },
  { rank: 10, name: 'Putri Laut', xp: 4800, level: 6, avatar: '👧', badge: '' },
];

interface LeaderboardProps {
  playerXp: number;
  playerLevel: number;
}

export default function Leaderboard({ playerXp, playerLevel }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('weekly');

  // Insert the player somewhere in the list
  const playerEntry = {
    rank: 0,
    name: 'Kamu ⭐',
    xp: playerXp,
    level: playerLevel,
    avatar: '🌟',
    badge: '',
    isPlayer: true,
  };

  const fullBoard = [...MOCK_LEADERBOARD.map(e => ({ ...e, isPlayer: false })), playerEntry]
    .sort((a, b) => b.xp - a.xp)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));

  const top3 = fullBoard.slice(0, 3);

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: 'var(--color-teal-dark)', marginBottom: '24px' }}>
        🏆 Papan Skor
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
        {(['weekly', 'alltime'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { playClick(); setActiveTab(tab); }}
            className="neo-btn"
            style={{
              background: activeTab === tab ? 'var(--color-teal)' : '#fff',
              color: activeTab === tab ? '#fff' : 'var(--color-text)',
              padding: '8px 24px',
            }}
          >
            {tab === 'weekly' ? '📅 Mingguan' : '🌍 Sepanjang Waktu'}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="neo-card animate-slide-up" style={{ marginBottom: '24px', padding: '32px 16px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '28px', color: 'var(--color-lemon-dark)' }}>
          👑 Top 3 Eco Guardians
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '16px' }}>
          {/* 2nd place */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div style={{
              width: '90px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>{top3[1]?.avatar || '🧑'}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                {top3[1]?.name || 'Unknown'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                {top3[1]?.xp.toLocaleString()} XP
              </div>
            </div>
            <div style={{
              height: '100px',
              background: 'linear-gradient(180deg, #C0C0C0, #A0A0A0)',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              border: '3px solid var(--border-color)',
              borderBottom: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#fff',
              textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
              marginTop: '8px',
            }}>
              🥈 2
            </div>
          </div>

          {/* 1st place */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div style={{
              width: '100px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '2px' }}>👑</div>
              <div style={{ fontSize: '3rem', marginBottom: '4px' }}>{top3[0]?.avatar || '🧑'}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '4px' }}>
                {top3[0]?.name || 'Unknown'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-lemon-dark)', fontWeight: 700 }}>
                {top3[0]?.xp.toLocaleString()} XP
              </div>
            </div>
            <div style={{
              height: '140px',
              background: 'linear-gradient(180deg, #FFD700, #FFA000)',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              border: '3px solid var(--border-color)',
              borderBottom: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#fff',
              textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
              marginTop: '8px',
              boxShadow: '0 0 20px rgba(255,215,0,0.3)',
            }}>
              🏆 1
            </div>
          </div>

          {/* 3rd place */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div style={{
              width: '90px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>{top3[2]?.avatar || '🧑'}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                {top3[2]?.name || 'Unknown'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                {top3[2]?.xp.toLocaleString()} XP
              </div>
            </div>
            <div style={{
              height: '80px',
              background: 'linear-gradient(180deg, #CD7F32, #A0522D)',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              border: '3px solid var(--border-color)',
              borderBottom: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#fff',
              textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
              marginTop: '8px',
            }}>
              🥉 3
            </div>
          </div>
        </div>
        {/* Podium base */}
        <div style={{
          height: '8px',
          background: 'var(--border-color)',
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          marginTop: '0',
        }} />
      </div>

      {/* Full table */}
      <div className="neo-card animate-slide-up" style={{ animationDelay: '0.4s', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '3px solid var(--border-color)' }}>
          <h3>📊 Peringkat Lengkap</h3>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {fullBoard.map((entry) => (
            <div
              key={entry.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                borderBottom: '2px solid #f0f0f0',
                background: entry.isPlayer
                  ? 'linear-gradient(90deg, #FFF9C4, #FFFDE7)'
                  : entry.rank <= 3
                  ? '#FAFAFA'
                  : '#fff',
                fontWeight: entry.isPlayer ? 800 : 500,
                transition: 'background 0.15s ease',
              }}
            >
              {/* Rank */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: entry.rank <= 3 ? '1rem' : '0.85rem',
                background: entry.rank === 1 ? '#FFD700'
                  : entry.rank === 2 ? '#C0C0C0'
                  : entry.rank === 3 ? '#CD7F32'
                  : '#f0f0f0',
                color: entry.rank <= 3 ? '#fff' : 'var(--color-text)',
                border: '2px solid var(--border-color)',
                flexShrink: 0,
              }}>
                {entry.rank}
              </div>

              {/* Avatar */}
              <span style={{ fontSize: '1.5rem' }}>{entry.avatar}</span>

              {/* Name */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem' }}>
                  {entry.badge && <span style={{ marginRight: '4px' }}>{entry.badge}</span>}
                  {entry.name}
                  {entry.isPlayer && <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: 'var(--color-teal)' }}>(Kamu!)</span>}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                  Level {entry.level}
                </div>
              </div>

              {/* XP */}
              <div style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: entry.isPlayer ? 'var(--color-lemon-dark)' : 'var(--color-teal-dark)',
              }}>
                {entry.xp.toLocaleString()} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
