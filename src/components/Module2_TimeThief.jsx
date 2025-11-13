import { useState } from 'react';

const TIME_THIEF_CARDS = [
  {
    id: 1,
    emoji: "📱",
    title: "끝없는 숏폼 영상",
    subtitle: "(틱톡, 릴스, 쇼츠)",
    description: "한 개만 보려고 했는데 1시간 순삭",
    estimatedTime: "하루 2시간"
  },
  {
    id: 2,
    emoji: "🎮",
    title: "한 판만... 게임",
    subtitle: "(롤, 배그, 메이플...)",
    description: "한 판이 10판으로 변하는 마법",
    estimatedTime: "하루 1.5시간"
  },
  {
    id: 3,
    emoji: "🛏️",
    title: "자기 전 침대에서 폰",
    subtitle: '"10분만" → 새벽 2시',
    description: "침대 = 폰 무한 스크롤 타임머신",
    estimatedTime: "하루 1.5시간"
  },
  {
    id: 4,
    emoji: "🔔",
    title: "알림 확인하다 증발",
    subtitle: "단톡방 999+",
    description: "알림 1개 확인 → 20개 앱 순회",
    estimatedTime: "하루 1시간"
  },
  {
    id: 5,
    emoji: "📺",
    title: "자동재생 유튜브",
    subtitle: '"다음 영상도 재밌을 것 같은데..."',
    description: "추천 알고리즘의 늪",
    estimatedTime: "하루 1시간"
  },
  {
    id: 6,
    emoji: "💭",
    title: "멍때리기",
    subtitle: "(진짜 아무것도 안 함)",
    description: "시간이 그냥 지나가는 중...",
    estimatedTime: "하루 45분"
  },
  {
    id: 7,
    emoji: "🎧",
    title: "음악 들으며 딴짓",
    subtitle: "집중한다면서 폰만 봄",
    description: "공부하는 척 플레이리스트 정리",
    estimatedTime: "하루 40분"
  },
  {
    id: 8,
    emoji: "🗂️",
    title: "완벽한 계획표 만들기",
    subtitle: "계획만 2시간, 실행 0분",
    description: "예쁜 스터디 플래너 꾸미기",
    estimatedTime: "하루 30분"
  },
  {
    id: 9,
    emoji: "🔍",
    title: "갑자기 궁금한 거 검색",
    subtitle: '"이 배우 이름이 뭐더라?"',
    description: "검색 → 위키백과 → 2시간 경과",
    estimatedTime: "하루 40분"
  },
  {
    id: 10,
    emoji: "💬",
    title: "친구 톡 답장 무한루프",
    subtitle: "30초마다 울리는 카톡",
    description: "대화 끝날 기미가 안 보임",
    estimatedTime: "하루 1시간"
  }
];

export default function Module2_TimeThief({ onComplete }) {
  const [step, setStep] = useState('intro');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [judgments, setJudgments] = useState({});
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleJudgment = (isThief) => {
    const card = TIME_THIEF_CARDS[currentCardIndex];
    setJudgments(prev => ({
      ...prev,
      [card.id]: isThief
    }));

    // 피드백 애니메이션
    setSwipeDirection(isThief ? 'right' : 'left');

    setTimeout(() => {
      setSwipeDirection(null);

      // 중간 성찰 (5장 후)
      if (currentCardIndex === 4) {
        setStep('midReflection');
      }
      // 완료 (10장 후)
      else if (currentCardIndex === TIME_THIEF_CARDS.length - 1) {
        setStep('complete');
      }
      // 다음 카드
      else {
        setCurrentCardIndex(prev => prev + 1);
      }
    }, 800);
  };

  const getTop3Thieves = () => {
    return TIME_THIEF_CARDS
      .filter(card => judgments[card.id])
      .slice(0, 3);
  };

  const calculateTotalTime = () => {
    const top3 = getTop3Thieves();
    // 간단하게 시간 문자열에서 숫자 추출
    const totalHours = top3.reduce((sum, card) => {
      const match = card.estimatedTime.match(/(\d+\.?\d*)/);
      return sum + (match ? parseFloat(match[1]) : 0);
    }, 0);
    return totalHours;
  };

  if (step === 'intro') {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)] text-center space-y-6 border border-neutral-200">
          <h2 className="text-3xl font-bold text-gray-800">
            이제 재밌는 게임 할 거야! 🎮
          </h2>

          <div className="text-6xl animate-scale-in">🕵️</div>

          <div className="space-y-3">
            <p className="text-xl font-semibold text-gray-800">
              시간도둑을 잡아야 해!
            </p>
            <div className="text-5xl">💨 🏃 💨</div>
          </div>

          <div className="bg-primary/10 p-6 rounded-xl space-y-3 border border-primary/20">
            <p className="text-gray-800 font-medium">
              카드가 나오면 판단해봐:
            </p>
            <div className="flex justify-between items-center text-sm">
              <div className="flex-1 text-left">
                <div className="font-bold text-gray-700">← 별로 안 빼앗음</div>
              </div>
              <div className="flex-1 text-right">
                <div className="font-bold text-gray-700">많이 빼앗음 →</div>
              </div>
            </div>
          </div>

          <p className="text-lg font-bold text-primary">총 10장! 시작!</p>

          <button
            onClick={() => setStep('cards')}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
          >
            시작하기
          </button>
        </div>
      </div>
    );
  }

  if (step === 'cards') {
    const card = TIME_THIEF_CARDS[currentCardIndex];

    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              카드 {currentCardIndex + 1} / {TIME_THIEF_CARDS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / TIME_THIEF_CARDS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card */}
        <div className={`bg-white rounded-3xl p-8 shadow-2xl transition-all duration-500 ${
          swipeDirection === 'right' ? 'translate-x-full opacity-0' :
          swipeDirection === 'left' ? '-translate-x-full opacity-0' :
          'translate-x-0 opacity-100'
        }`}>
          <div className="text-center space-y-6">
            <div className="text-8xl">{card.emoji}</div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 font-medium mb-3">
                {card.subtitle}
              </p>
              <p className="text-gray-700">
                {card.description}
              </p>
            </div>

            <div className="bg-warning/10 border-2 border-warning rounded-xl p-3">
              <p className="text-sm font-semibold text-gray-700">
                예상: {card.estimatedTime}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        {!swipeDirection && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => handleJudgment(false)}
              className="flex-1 py-4 bg-neutral-300 text-neutral-700 rounded-xl font-bold text-lg hover:bg-neutral-400 hover:shadow-[var(--shadow-soft)] transition-all"
            >
              별로 안 빼앗음
            </button>
            <button
              onClick={() => handleJudgment(true)}
              className="flex-1 py-4 bg-warning text-white rounded-xl font-bold text-lg hover:bg-warning/90 hover:shadow-[var(--shadow-hover)] transition-all"
            >
              많이 빼앗음!
            </button>
          </div>
        )}

        {/* Feedback */}
        {swipeDirection && (
          <div className="mt-6 text-center animate-scale-in">
            <div className="text-6xl mb-2">🎉</div>
            <p className="text-2xl font-bold text-primary">
              {swipeDirection === 'right' ? '많이 빼앗음!' : '별로 안 빼앗음'}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (step === 'midReflection') {
    const thiefCount = Object.values(judgments).filter(Boolean).length;
    const notThiefCount = 5 - thiefCount;

    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)] text-center space-y-6 border border-neutral-200">
          <h2 className="text-2xl font-bold text-gray-800">
            잠깐! 멈춰볼까? 🤔
          </h2>

          <p className="text-gray-700">지금까지 5개 카드 중...</p>

          <div className="space-y-3">
            <div className="bg-warning/15 border-2 border-warning/50 rounded-xl p-4">
              <p className="text-xl font-bold text-orange-700">
                "많이 빼앗음" {thiefCount}개
              </p>
            </div>
            <div className="bg-neutral-100 border-2 border-neutral-300 rounded-xl p-4">
              <p className="text-xl font-bold text-gray-700">
                "별로 안 빼앗음" {notThiefCount}개
              </p>
            </div>
          </div>

          <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
            <div className="text-4xl mb-3">💡</div>
            <p className="font-semibold text-gray-800">패턴 발견!</p>
            <p className="text-gray-700 mt-2">
              {thiefCount >= 3
                ? "대부분 '화면 시간'이네! 📱 SNS, 유튜브, 게임이 주요 시간도둑인 것 같아!"
                : "시간도둑이 생각보다 적네! 계속 확인해보자!"}
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentCardIndex(5);
              setStep('cards');
            }}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
          >
            계속하기
          </button>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)] text-center space-y-6 border border-neutral-200">
          <div className="text-7xl">🎊</div>
          <h2 className="text-3xl font-bold text-gray-800">잘했어!</h2>
          <p className="text-xl text-gray-700">모든 시간도둑을 찾았어!</p>

          <button
            onClick={() => setStep('results')}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
          >
            결과 보기
          </button>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const top3 = getTop3Thieves();
    const totalTime = calculateTotalTime();

    return (
      <div className="max-w-lg mx-auto animate-fade-in space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)] border border-neutral-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            🏆 너의 시간도둑 TOP 3
          </h2>

          <div className="space-y-4">
            {top3.map((card, index) => (
              <div
                key={card.id}
                className="bg-gradient-to-r from-warning/10 to-warning/5 border-2 border-warning/30 rounded-xl p-4 animate-scale-in shadow-[var(--shadow-soft)]"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{card.emoji}</div>
                      <div>
                        <h3 className="font-bold text-gray-800">{card.title}</h3>
                        <p className="text-sm text-gray-600">{card.subtitle}</p>
                        <p className="text-sm font-semibold text-orange-600 mt-1">
                          예상: {card.estimatedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-2xl p-6 shadow-[var(--shadow-card)]">
          <div className="text-center space-y-4">
            <div className="text-5xl">💰</div>
            <h3 className="text-xl font-bold text-gray-800">시간 계산해볼까?</h3>
            <div className="space-y-2">
              <p className="text-gray-700">이 3가지 시간도둑이 훔쳐가는 시간은...</p>
              <div className="text-4xl font-bold text-primary">
                하루 {totalTime.toFixed(1)}시간
              </div>
              <p className="text-gray-700">
                = 일주일 {(totalTime * 7).toFixed(0)}시간!<br />
                = 한 달 {(totalTime * 30).toFixed(0)}시간!
              </p>
              <p className="text-lg font-bold text-orange-600">
                😮 한 달이면 {(totalTime * 30 / 24).toFixed(0)}일치나 돼!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-success/10 border-2 border-success/40 rounded-2xl p-6 shadow-[var(--shadow-card)]">
          <div className="text-center space-y-3">
            <div className="text-4xl">🌟</div>
            <h3 className="text-xl font-bold text-gray-800">만약 이 시간을 되찾으면...</h3>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {['📚 책 10권 읽기', '🎸 악기 배우기', '💪 매일 운동하기', '🎨 그림 실력 up!', '👨‍👩‍👧 가족 시간 늘리기', '🎯 꿈에 한 걸음!'].map((item, i) => (
                <div key={i} className="bg-white rounded-lg p-3 text-sm font-semibold text-gray-700">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-gray-700 font-semibold mt-4">할 수 있는 게 엄청 많아!</p>
          </div>
        </div>

        <button
          onClick={() => {
            onComplete({
              top3,
              totalTime,
              allJudgments: judgments
            });
          }}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
        >
          다음으로
        </button>
      </div>
    );
  }

  return null;
}
