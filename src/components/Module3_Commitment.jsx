import { useState } from 'react';

const STRATEGIES = {
  "끝없는 숏폼 영상": [
    { title: "앱 사용 시간 30분 제한", difficulty: "보통", effectiveness: 4, description: "스크린타임 기능 활용" },
    { title: "숏폼 대신 긴 영상 보기", difficulty: "쉬움", effectiveness: 3, description: "의도적으로 종료 시점 만들기" },
    { title: "앱을 폴더 깊이 숨기기", difficulty: "쉬움", effectiveness: 3, description: "접근 어렵게 만들기" },
  ],
  "자기 전 침대에서 폰": [
    { title: "폰을 침대 밖에 두기", difficulty: "보통", effectiveness: 5, description: "물리적 거리 만들기" },
    { title: "9시부터 흑백 모드", difficulty: "쉬움", effectiveness: 4, description: "폰을 지루하게 만들기" },
    { title: "대신 책 읽기", difficulty: "쉬움", effectiveness: 3, description: "대체 습관 만들기" },
  ],
  "한 판만... 게임": [
    { title: "타이머 맞추고 게임하기", difficulty: "보통", effectiveness: 4, description: "시간 약속 지키기" },
    { title: "게임 전 할 일 먼저", difficulty: "보통", effectiveness: 4, description: "보상으로 게임하기" },
    { title: "친구와 시간 약속", difficulty: "쉬움", effectiveness: 3, description: "같이 제한하기" },
  ],
  "default": [
    { title: "알람 맞추기", difficulty: "쉬움", effectiveness: 3, description: "시간 체크하기" },
    { title: "대체 활동 준비", difficulty: "보통", effectiveness: 4, description: "다른 재밌는 것 하기" },
    { title: "친구/가족에게 도움 요청", difficulty: "쉬움", effectiveness: 4, description: "함께 변화하기" },
  ]
};

export default function Module3_Commitment({ timeThieves, onComplete }) {
  const [step, setStep] = useState('intro');
  const [selectedThief, setSelectedThief] = useState(null);
  const [targetMinutes, setTargetMinutes] = useState(30);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const top3 = timeThieves?.top3 || [];

  const getStrategies = (thiefTitle) => {
    return STRATEGIES[thiefTitle] || STRATEGIES.default;
  };

  const getCurrentTime = (thief) => {
    const match = thief.estimatedTime.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) * 60 : 90; // 분 단위로 변환
  };

  if (step === 'intro') {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)] text-center space-y-6 border border-neutral-200">
          <h2 className="text-3xl font-bold text-gray-800">
            이제 변화를 만들어볼까? 💪
          </h2>

          <p className="text-gray-700">
            시간도둑 TOP 3 중<br />
            <span className="font-bold text-primary">하나만</span> 줄여보자!
          </p>

          <div className="space-y-3">
            {top3.map((thief, index) => (
              <button
                key={thief.id}
                onClick={() => {
                  setSelectedThief(thief);
                  setStep('setGoal');
                }}
                className="w-full p-4 bg-gradient-to-r from-warning/10 to-warning/5 border-2 border-warning/30 rounded-xl hover:border-warning hover:shadow-[var(--shadow-soft)] transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="text-4xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="text-3xl">{thief.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">{thief.title}</div>
                    <div className="text-sm text-gray-600">{thief.estimatedTime}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'setGoal') {
    const currentMinutes = getCurrentTime(selectedThief);

    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-6 border border-neutral-200">
          <div className="text-center">
            <div className="text-6xl mb-3">{selectedThief.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedThief.title}
            </h2>
            <p className="text-gray-600">
              현재: {selectedThief.estimatedTime}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              얼마나 줄이고 싶어?
            </h3>

            <div className="space-y-3">
              <input
                type="range"
                min="15"
                max={currentMinutes}
                step="15"
                value={targetMinutes}
                onChange={(e) => setTargetMinutes(Number(e.target.value))}
                className="w-full"
              />

              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {Math.floor(targetMinutes / 60) > 0 && `${Math.floor(targetMinutes / 60)}시간 `}
                  {targetMinutes % 60}분
                </div>
                <p className="text-sm text-gray-600">목표 시간</p>
              </div>

              <div className="bg-success/10 border-2 border-success/40 rounded-xl p-4 text-center shadow-[var(--shadow-soft)]">
                <div className="text-2xl font-bold text-green-700">
                  {Math.floor((currentMinutes - targetMinutes) / 60) > 0 &&
                    `${Math.floor((currentMinutes - targetMinutes) / 60)}시간 `}
                  {(currentMinutes - targetMinutes) % 60}분을 되찾는 거야!
                </div>
                <div className="text-6xl mt-2">🕵️</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep('selectStrategy')}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  if (step === 'selectStrategy') {
    const strategies = getStrategies(selectedThief.title);

    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-6 border border-neutral-200">
          <div className="text-center">
            <div className="text-5xl mb-3">🤖</div>
            <h2 className="text-2xl font-bold text-gray-800">
              도움이 될 만한 방법들!
            </h2>
          </div>

          <div className="space-y-3">
            {strategies.map((strategy, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedStrategy(strategy);
                  setStep('commitment');
                }}
                className="w-full p-5 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl hover:border-primary hover:shadow-[var(--shadow-soft)] transition-all text-left"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-gray-800 text-lg flex-1">
                      💡 {strategy.title}
                    </h3>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <span className="px-3 py-1 bg-white rounded-full text-gray-700">
                      난이도: {strategy.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-gray-700">
                      효과: {'★'.repeat(strategy.effectiveness)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {strategy.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'commitment') {
    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    return (
      <div className="max-w-lg mx-auto animate-fade-in space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-6 border border-neutral-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ✍️ 나의 다짐을 완성하자!
            </h2>
          </div>

          <div className="bg-gradient-to-br from-warning/15 to-warning/10 border-3 border-warning/40 rounded-2xl p-6 space-y-4 shadow-[var(--shadow-card)]">
            <div className="text-center text-3xl font-bold text-gray-800 mb-4">
              💪 나의 다짐
            </div>

            <div className="space-y-3 text-gray-800">
              <div>
                <div className="text-sm text-gray-600 mb-1">줄이고 싶은 습관:</div>
                <div className="font-bold text-lg">{selectedThief.title}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">목표:</div>
                <div className="font-bold text-lg">
                  {selectedThief.estimatedTime} → {Math.floor(targetMinutes / 60) > 0 &&
                    `${Math.floor(targetMinutes / 60)}시간 `}
                  {targetMinutes % 60}분
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">내가 할 방법:</div>
                <div className="font-bold text-lg">
                  💡 {selectedStrategy.title}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">시작일:</div>
                <div className="font-bold text-lg">{dateStr}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                // 스크린샷 힌트
                alert('스크린샷을 찍어서 저장해보세요! 📸');
              }}
              className="flex-1 py-3 bg-neutral-200 text-neutral-700 rounded-xl font-bold hover:bg-neutral-300 hover:shadow-[var(--shadow-soft)] transition-all"
            >
              📸 스크린샷
            </button>
            <button
              onClick={() => setStep('encouragement')}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'encouragement') {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <div className="text-center space-y-4">
            <div className="text-7xl">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800">다짐 완성!</h2>

            <div className="bg-primary/10 p-6 rounded-xl space-y-4 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🕵️</div>
                <div className="text-left">
                  <p className="text-gray-800 font-semibold mb-2">잘했어!</p>
                  <p className="text-gray-700">
                    이제 시간도둑과 싸울 준비가 됐네!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 border-2 border-warning rounded-xl p-6 space-y-3 shadow-[var(--shadow-soft)]">
              <div className="text-3xl">💡</div>
              <p className="font-semibold text-gray-800">중요한 팁:</p>
              <div className="text-left space-y-2 text-gray-700">
                <p>✅ 완벽하게 안 해도 괜찮아</p>
                <p>✅ 조금씩 줄이는 것만으로도 성공!</p>
                <p>✅ 안 되면 다음 시간에 함께 고민!</p>
              </div>
            </div>

            <p className="text-lg text-gray-800 font-semibold">
              다음 시간까지 한 번 시도해봐!
            </p>
          </div>

          <button
            onClick={() => {
              const commitmentData = {
                thief: selectedThief,
                targetMinutes,
                strategy: selectedStrategy,
                date: new Date().toISOString()
              };
              onComplete(commitmentData);
            }}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
          >
            마무리로 →
          </button>
        </div>
      </div>
    );
  }

  return null;
}
