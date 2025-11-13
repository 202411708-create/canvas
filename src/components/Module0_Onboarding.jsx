import { useState, useEffect } from 'react';

export default function Module0_Onboarding({ onComplete }) {
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    const timers = [];

    if (screen === 0) {
      // Screen 0: 로고 2초
      timers.push(setTimeout(() => setScreen(1), 2000));
    } else if (screen === 1) {
      // Screen 1: 첫 인사 3초
      timers.push(setTimeout(() => setScreen(2), 3000));
    } else if (screen === 2) {
      // Screen 2: 미션 소개 4초
      timers.push(setTimeout(() => setScreen(3), 4000));
    } else if (screen === 3) {
      // Screen 3: 카운트다운 자동 시작
      timers.push(setTimeout(() => setCountdown(3), 500));
    }

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [screen]);

  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // 카운트다운 끝나면 Module 1로
      const timer = setTimeout(() => onComplete(), 500);
      return () => clearTimeout(timer);
    }
  }, [countdown, onComplete]);

  return (
    <div className="flex items-center justify-center min-h-[600px] px-4">
      {/* Screen 0: 로고 */}
      {screen === 0 && (
        <div className="text-center animate-fade-in">
          <div className="text-8xl mb-4">🕵️</div>
          <h1 className="text-3xl font-bold text-textDark">시간탐정 프로그램</h1>
        </div>
      )}

      {/* Screen 1: 첫 인사 */}
      {screen === 1 && (
        <div className="text-center animate-fade-in space-y-6 max-w-md">
          <div className="text-7xl">🕵️</div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)] animate-scale-in border border-neutral-200">
            <p className="text-xl text-textDark leading-relaxed">
              안녕! 나는 시간탐정이야
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)] animate-scale-in border border-neutral-200" style={{ animationDelay: '0.3s' }}>
            <p className="text-xl text-textDark leading-relaxed">
              오늘 너랑 특별한 미션을<br />
              함께 할 거야!
            </p>
          </div>
        </div>
      )}

      {/* Screen 2: 미션 소개 */}
      {screen === 2 && (
        <div className="text-center animate-fade-in space-y-8 max-w-lg">
          <div className="bg-gradient-to-br from-warning/80 to-warning rounded-3xl p-8 shadow-[var(--shadow-card)] border border-warning/20">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-sm">오늘의 미션</h2>
            <p className="text-2xl font-bold text-white drop-shadow-sm">
              나의 시간 사용<br />
              알아보기
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)] border border-neutral-200">
            <div className="text-6xl mb-4">🕵️</div>
            <p className="text-lg text-textDark leading-relaxed">
              <span className="font-bold text-primary">시간은 돈보다 소중해!</span><br />
              지나간 시간은 절대 돌아오지 않거든.
            </p>
            <p className="text-lg text-textDark mt-4 leading-relaxed">
              오늘은 네가 시간을 어떻게<br />
              쓰고 있는지 탐험해볼 거야!
            </p>
          </div>
        </div>
      )}

      {/* Screen 3: 카운트다운 */}
      {screen === 3 && (
        <div className="text-center animate-fade-in space-y-8">
          <h2 className="text-4xl font-bold text-textDark">준비됐어?</h2>

          {countdown !== null && countdown > 0 && (
            <div className="text-9xl font-bold text-primary animate-scale-in drop-shadow-lg">
              {countdown}
            </div>
          )}

          {countdown === 0 && (
            <div className="animate-scale-in space-y-4">
              <div className="text-7xl">🚀</div>
              <h2 className="text-5xl font-bold text-primary drop-shadow-md">출발!</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
