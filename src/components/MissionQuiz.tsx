import { useState, useCallback } from 'react';
import { playClick, playSuccess, playError, playCoin } from '../utils/soundEffects';

interface MissionQuizProps {
  onXpGain: (amount: number) => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  emoji: string;
}

const QUIZ_DATA: QuizQuestion[] = [
  {
    question: 'Sampah kulit pisang termasuk jenis sampah apa?',
    options: ['Anorganik', 'Organik', 'B3 (Berbahaya)', 'Logam'],
    correctIndex: 1,
    explanation: 'Kulit pisang adalah sampah organik karena berasal dari makhluk hidup dan bisa terurai secara alami! 🌱',
    emoji: '🍌',
  },
  {
    question: 'Apa yang terjadi jika saluran air tersumbat sampah?',
    options: ['Air jadi bersih', 'Banjir bisa terjadi', 'Tanaman tumbuh subur', 'Tidak terjadi apa-apa'],
    correctIndex: 1,
    explanation: 'Sampah yang menyumbat saluran air membuat air tidak bisa mengalir, sehingga bisa menyebabkan banjir! 🌊',
    emoji: '🌊',
  },
  {
    question: 'Berapa lama plastik terurai di alam?',
    options: ['1 minggu', '1 bulan', '1 tahun', 'Ratusan tahun'],
    correctIndex: 3,
    explanation: 'Plastik membutuhkan waktu hingga 450 tahun untuk terurai! Makanya kita harus mengurangi penggunaan plastik. ♻️',
    emoji: '🔬',
  },
  {
    question: 'Warna tempat sampah untuk sampah organik biasanya?',
    options: ['Merah', 'Biru', 'Hijau', 'Kuning'],
    correctIndex: 2,
    explanation: 'Tempat sampah hijau digunakan untuk sampah organik yang bisa terurai seperti sisa makanan dan daun! 🟢',
    emoji: '🗑️',
  },
  {
    question: 'Baterai bekas termasuk jenis sampah apa?',
    options: ['Organik', 'Anorganik', 'B3 (Berbahaya)', 'Daur ulang'],
    correctIndex: 2,
    explanation: 'Baterai mengandung zat kimia berbahaya yang bisa mencemari tanah dan air. Harus dibuang di tempat khusus! ☠️',
    emoji: '🔋',
  },
  {
    question: 'Apa manfaat mendaur ulang kertas?',
    options: ['Menghemat pohon', 'Membuat banjir', 'Mencemari udara', 'Tidak ada manfaat'],
    correctIndex: 0,
    explanation: 'Mendaur ulang 1 ton kertas bisa menghemat 17 pohon! Yuk, selalu pisahkan kertas bekas! 🌳',
    emoji: '📄',
  },
  {
    question: 'Apa yang bisa kita lakukan untuk mencegah banjir?',
    options: ['Buang sampah ke sungai', 'Menjaga kebersihan selokan', 'Menebang pohon', 'Menutup semua saluran air'],
    correctIndex: 1,
    explanation: 'Menjaga kebersihan selokan dan saluran air membantu air mengalir lancar sehingga mencegah banjir! 💪',
    emoji: '🛡️',
  },
  {
    question: 'Apa singkatan dari 3R dalam pengelolaan sampah?',
    options: ['Read, Run, Rest', 'Reduce, Reuse, Recycle', 'Red, Rose, Rain', 'Repair, Rebuild, Return'],
    correctIndex: 1,
    explanation: 'Reduce (Kurangi), Reuse (Gunakan kembali), Recycle (Daur ulang) — 3 langkah untuk selamatkan Bumi! 🌍',
    emoji: '♻️',
  },
];

const VIDEO_STORIES = [
  {
    title: '🌊 Cerita: Si Kancil dan Sungai Kotor',
    content: 'Di sebuah desa kecil, Si Kancil melihat sungai yang biasa ia minum airnya menjadi kotor dan berbau. Ternyata, banyak warga yang membuang sampah ke sungai! Si Kancil pun mengajak teman-temannya membersihkan sungai bersama-sama.',
    moral: '💡 Sungai yang bersih = Air minum yang sehat untuk semua makhluk hidup!',
    emoji: '🦌',
  },
  {
    title: '🏠 Cerita: Banjir di Kampung Pelangi',
    content: 'Kampung Pelangi selalu indah dan bersih. Tapi suatu hari, hujan deras turun dan banjir melanda! Ternyata selokan tersumbat oleh sampah plastik dan botol. Warga belajar bahwa menjaga kebersihan selokan sangat penting.',
    moral: '💡 Jangan buang sampah ke selokan! Selokan bersih = kampung aman dari banjir!',
    emoji: '🏘️',
  },
];

export default function MissionQuiz({ onXpGain }: MissionQuizProps) {
  const [phase, setPhase] = useState<'story' | 'quiz' | 'result'>('story');
  const [storyIndex, setStoryIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(QUIZ_DATA.length).fill(false));
  const [showConfetti, setShowConfetti] = useState(false);

  const handleStoryNext = () => {
    playClick();
    if (storyIndex < VIDEO_STORIES.length - 1) {
      setStoryIndex(prev => prev + 1);
    } else {
      setPhase('quiz');
    }
  };

  const handleAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const correct = index === QUIZ_DATA[currentQuestion].correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playSuccess();
      setScore(prev => prev + 1);
      onXpGain(15);
    } else {
      playError();
    }

    const newAnswered = [...answered];
    newAnswered[currentQuestion] = true;
    setAnswered(newAnswered);
  }, [selectedAnswer, currentQuestion, answered, onXpGain]);

  const handleNext = () => {
    playClick();
    if (currentQuestion < QUIZ_DATA.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setPhase('result');
      if (score >= 6) {
        setShowConfetti(true);
        playCoin();
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const handleRestart = () => {
    playClick();
    setPhase('story');
    setStoryIndex(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setAnswered(new Array(QUIZ_DATA.length).fill(false));
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 40 }).map((_, i) => (
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
        📚 Misi Belajar & Kuis
      </h1>

      {/* Phase: Story */}
      {phase === 'story' && (
        <div className="neo-card animate-slide-up" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{VIDEO_STORIES[storyIndex].emoji}</div>
          <h2 style={{ marginBottom: '16px', color: 'var(--color-teal-dark)' }}>
            {VIDEO_STORIES[storyIndex].title}
          </h2>
          {/* Simulated video/story card */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 24px',
            color: '#fff',
            marginBottom: '20px',
            border: '3px solid var(--border-color)',
            boxShadow: '4px 4px 0 var(--shadow-color)',
            minHeight: '180px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '16px',
          }}>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              {VIDEO_STORIES[storyIndex].content}
            </p>
            <p style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}>
              {VIDEO_STORIES[storyIndex].moral}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Cerita {storyIndex + 1} dari {VIDEO_STORIES.length}
            </span>
          </div>
          <button
            className="neo-btn neo-btn-primary"
            onClick={handleStoryNext}
            style={{ marginTop: '20px', padding: '12px 32px', fontSize: '1.1rem' }}
          >
            {storyIndex < VIDEO_STORIES.length - 1 ? 'Cerita Berikutnya ➡️' : 'Mulai Kuis! 🎯'}
          </button>
        </div>
      )}

      {/* Phase: Quiz */}
      {phase === 'quiz' && (
        <div>
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            {QUIZ_DATA.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '10px',
                  borderRadius: '5px',
                  border: '2px solid var(--border-color)',
                  background: i === currentQuestion
                    ? 'var(--color-lemon)'
                    : answered[i]
                    ? 'var(--color-green)'
                    : '#e0e0e0',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>

          <div className="neo-card animate-slide-up" key={currentQuestion}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-teal">Pertanyaan {currentQuestion + 1}/{QUIZ_DATA.length}</span>
              <span className="badge badge-lemon">⭐ Skor: {score}</span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '3rem' }}>{QUIZ_DATA[currentQuestion].emoji}</span>
              <h2 style={{ marginTop: '12px', fontSize: '1.3rem', lineHeight: '1.5' }}>
                {QUIZ_DATA[currentQuestion].question}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {QUIZ_DATA[currentQuestion].options.map((option, i) => {
                let bg = '#fff';
                let borderColor = 'var(--border-color)';
                let color = 'var(--color-text)';

                if (selectedAnswer !== null) {
                  if (i === QUIZ_DATA[currentQuestion].correctIndex) {
                    bg = 'var(--color-green)';
                    color = '#fff';
                    borderColor = 'var(--color-green-dark)';
                  } else if (i === selectedAnswer && !isCorrect) {
                    bg = 'var(--color-coral)';
                    color = '#fff';
                    borderColor = 'var(--color-coral-dark)';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={selectedAnswer === i ? (isCorrect ? 'animate-pop-in' : 'animate-shake') : ''}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: `3px solid ${borderColor}`,
                      boxShadow: selectedAnswer === null ? '4px 4px 0 var(--shadow-color)' : '2px 2px 0 var(--shadow-color)',
                      background: bg,
                      color: color,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: selectedAnswer !== null ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ marginRight: '8px', opacity: 0.6 }}>
                      {['A', 'B', 'C', 'D'][i]}.
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {selectedAnswer !== null && (
              <div
                className="animate-slide-up"
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: isCorrect ? '#E8F5E9' : '#FFEBEE',
                  border: `2px solid ${isCorrect ? 'var(--color-green)' : 'var(--color-coral)'}`,
                  marginBottom: '16px',
                }}
              >
                <p style={{ fontWeight: 700, marginBottom: '6px' }}>
                  {isCorrect ? '✅ Benar! Keren banget!' : '❌ Hmm, belum tepat!'}
                </p>
                <p style={{ fontSize: '0.9rem' }}>
                  {QUIZ_DATA[currentQuestion].explanation}
                </p>
              </div>
            )}

            {selectedAnswer !== null && (
              <div style={{ textAlign: 'center' }}>
                <button
                  className="neo-btn neo-btn-primary"
                  onClick={handleNext}
                  style={{ padding: '10px 28px' }}
                >
                  {currentQuestion < QUIZ_DATA.length - 1 ? 'Pertanyaan Berikutnya ➡️' : 'Lihat Hasil! 🏆'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase: Result */}
      {phase === 'result' && (
        <div className="neo-card animate-bounce-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '16px' }}>
            {score >= 7 ? '🏆' : score >= 5 ? '🌟' : score >= 3 ? '💪' : '📚'}
          </div>
          <h2 style={{ marginBottom: '8px', color: 'var(--color-teal-dark)' }}>
            {score >= 7 ? 'Luar Biasa! Kamu Eco Champion!' : score >= 5 ? 'Bagus Sekali!' : score >= 3 ? 'Lumayan! Terus Belajar!' : 'Ayo Coba Lagi!'}
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
            Skor: <strong>{score}</strong> / {QUIZ_DATA.length}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            XP didapat: <strong style={{ color: 'var(--color-lemon-dark)' }}>+{score * 15} XP</strong>
          </p>

          {/* Stars */}
          <div style={{ fontSize: '2.5rem', marginBottom: '24px', letterSpacing: '8px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ opacity: i < Math.ceil(score / QUIZ_DATA.length * 5) ? 1 : 0.2 }}>⭐</span>
            ))}
          </div>

          <button className="neo-btn neo-btn-success" onClick={handleRestart} style={{ padding: '12px 32px', fontSize: '1.1rem' }}>
            🔄 Main Lagi
          </button>
        </div>
      )}
    </div>
  );
}
