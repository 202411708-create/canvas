import { useState } from 'react';

const ACTIVITY_CARDS = [
  { id: 'sns', emoji: '📱', label: 'SNS' },
  { id: 'game', emoji: '🎮', label: '게임' },
  { id: 'study', emoji: '📚', label: '공부' },
  { id: 'meal', emoji: '🍔', label: '식사' },
  { id: 'youtube', emoji: '📺', label: '유튜브' },
  { id: 'rest', emoji: '💭', label: '휴식' },
  { id: 'transport', emoji: '🚌', label: '이동' },
  { id: 'other', emoji: '➕', label: '기타' },
];

const TIME_ZONES = [
  { id: 'afternoon', label: '방과 후', emoji: '🌅', start: '3시', end: '6시', hours: 3 },
  { id: 'evening', label: '저녁 시간', emoji: '🌆', start: '6시', end: '9시', hours: 3 },
  { id: 'night', label: '자기 전', emoji: '🌙', start: '9시', end: '11시', hours: 2 },
];

export default function Module1_TimeMap({ onComplete }) {
  const [step, setStep] = useState('sleep');
  const [sleepTime, setSleepTime] = useState(null);
  const [wakeTime, setWakeTime] = useState(null);
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [activityTimes, setActivityTimes] = useState({});
  const [allZoneData, setAllZoneData] = useState({});

  // 수면 시간 선택
  const handleSleepTimeSelect = (hour) => {
    setSleepTime(hour);
    setTimeout(() => setStep('wake'), 300);
  };

  // 기상 시간 선택
  const handleWakeTimeSelect = (hour) => {
    setWakeTime(hour);
    setTimeout(() => setStep('sleepResult'), 300);
  };

  // 수면 시간 계산
  const calculateSleepHours = () => {
    if (!sleepTime || !wakeTime) return 0;
    let hours = wakeTime - sleepTime;
    if (hours < 0) hours += 24;
    return hours;
  };

  // 다음 단계로
  const goToZoneIntro = () => {
    setStep('zoneIntro');
  };

  // 활동 선택
  const toggleActivity = (activityId) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  // 활동 시간 입력으로 이동
  const goToTimeInput = () => {
    if (selectedActivities.length === 0) return;
    setStep('timeInput');
  };

  // 시간 입력 완료
  const handleTimeInput = (activityId, minutes) => {
    setActivityTimes(prev => ({ ...prev, [activityId]: minutes }));
  };

  // 남은 시간 계산
  const getRemainingMinutes = () => {
    const zone = TIME_ZONES[currentZoneIndex];
    const totalMinutes = zone.hours * 60;
    const usedMinutes = Object.values(activityTimes).reduce((sum, min) => sum + min, 0);
    return totalMinutes - usedMinutes;
  };

  // 현재 구역 완료
  const completeCurrentZone = () => {
    const zone = TIME_ZONES[currentZoneIndex];
    setAllZoneData(prev => ({
      ...prev,
      [zone.id]: {
        activities: { ...activityTimes }
      }
    }));

    // 다음 구역으로
    if (currentZoneIndex < TIME_ZONES.length - 1) {
      setCurrentZoneIndex(prev => prev + 1);
      setSelectedActivities([]);
      setActivityTimes({});
      setStep('selectActivity');
    } else {
      // 모든 구역 완료
      setStep('results');
    }
  };

  // 결과 데이터 계산
  const calculateResults = () => {
    const activities = {};
    Object.values(allZoneData).forEach(zone => {
      Object.entries(zone.activities).forEach(([activityId, minutes]) => {
        activities[activityId] = (activities[activityId] || 0) + minutes;
      });
    });

    const total = Object.values(activities).reduce((sum, min) => sum + min, 0);
    const sorted = Object.entries(activities)
      .map(([id, minutes]) => ({
        id,
        minutes,
        hours: (minutes / 60).toFixed(1),
        percentage: ((minutes / total) * 100).toFixed(0)
      }))
      .sort((a, b) => b.minutes - a.minutes);

    return sorted;
  };

  // 스크린 타임 계산
  const calculateScreenTime = (results) => {
    const screenActivities = ['sns', 'game', 'youtube'];
    return results
      .filter(r => screenActivities.includes(r.id))
      .reduce((sum, r) => sum + r.minutes, 0);
  };

  const renderTimeSelector = (type) => {
    const times = type === 'sleep'
      ? [20, 21, 22, 23, 0, 1, 2, 3]
      : [5, 6, 7, 8, 9, 10, 11, 12];

    const labels = type === 'sleep'
      ? ['오후 8시', '9시', '10시', '11시', '자정', '새벽 1시', '2시', '3시']
      : ['새벽 5시', '6시', '7시', '8시', '9시', '10시', '11시', '정오'];

    return (
      <div className="animate-fade-in space-y-6">
        <h2 className="text-2xl font-bold text-textDark text-center">
          {type === 'sleep' ? '어제 몇 시에 잤어? 🌙' : '오늘 아침 몇 시에 일어났어? ☀️'}
        </h2>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)] border border-neutral-200">
          <div className="grid grid-cols-2 gap-3">
            {times.map((hour, index) => (
              <button
                key={hour}
                onClick={() => type === 'sleep' ? handleSleepTimeSelect(hour) : handleWakeTimeSelect(hour)}
                className="py-4 px-6 text-lg font-bold rounded-xl border-2 border-neutral-300 hover:border-primary hover:bg-neutral-100 hover:shadow-[var(--shadow-soft)] transition-all"
              >
                {labels[index]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (step === 'sleep') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)] mb-6 border border-neutral-200">
          <h1 className="text-2xl font-bold text-textDark text-center mb-4">
            어제를 떠올려보자! 🌙
          </h1>
          <p className="text-neutral-700 text-center">
            먼저 기억의 닻을 내릴게 ⚓
          </p>
        </div>
        {renderTimeSelector('sleep')}
      </div>
    );
  }

  if (step === 'wake') {
    return (
      <div className="max-w-lg mx-auto">
        {renderTimeSelector('wake')}
      </div>
    );
  }

  if (step === 'sleepResult') {
    const sleepHours = calculateSleepHours();
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-[var(--shadow-card)] text-center space-y-6 border border-neutral-200">
          <div className="text-6xl">😴</div>
          <div className="space-y-2">
            <div className="text-5xl font-bold text-primary">{sleepHours}시간</div>
            <p className="text-xl text-neutral-700">수면 시간</p>
          </div>
          <div className="text-6xl">🕵️</div>
          <p className="text-xl font-semibold text-textDark">잘 잤네! 👍</p>
          <button
            onClick={goToZoneIntro}
            className="mt-6 px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  if (step === 'zoneIntro') {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)] space-y-6 border border-neutral-200">
          <h2 className="text-2xl font-bold text-textDark text-center">
            이제 어제를 4개 구역으로 나눠볼게!
          </h2>

          <div className="space-y-4">
            {TIME_ZONES.map((zone, index) => (
              <div key={zone.id} className="flex items-center gap-4 p-4 bg-neutral-100 rounded-xl border border-neutral-200">
                <div className="text-4xl">{zone.emoji}</div>
                <div>
                  <div className="font-bold text-gray-800">{zone.label}</div>
                  <div className="text-sm text-gray-600">{zone.start} ~ {zone.end}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🕵️</div>
              <p className="text-neutral-700">
                학교 시간은 정해져 있으니<br />
                방과 후부터 채워보자!
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep('selectActivity')}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
          >
            시작하기
          </button>
        </div>
      </div>
    );
  }

  if (step === 'selectActivity') {
    const zone = TIME_ZONES[currentZoneIndex];
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-6 border border-neutral-200">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-textDark">
                {zone.emoji} {zone.label} ({zone.start}~{zone.end})
              </h2>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3 shadow-inner">
              <div className="bg-primary h-3 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <p className="text-sm text-neutral-700 mt-1">남은 시간: {zone.hours}시간</p>
          </div>

          <div>
            <h3 className="font-bold text-textDark mb-3">뭐 했어? (여러 개 선택 가능)</h3>
            <div className="grid grid-cols-4 gap-3">
              {ACTIVITY_CARDS.map(activity => (
                <button
                  key={activity.id}
                  onClick={() => toggleActivity(activity.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedActivities.includes(activity.id)
                      ? 'border-primary bg-primary/10 scale-105 shadow-[var(--shadow-soft)]'
                      : 'border-neutral-300 hover:border-neutral-400 hover:shadow-[var(--shadow-soft)]'
                  }`}
                >
                  <div className="text-3xl mb-1">{activity.emoji}</div>
                  <div className="text-xs font-semibold">{activity.label}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={goToTimeInput}
            disabled={selectedActivities.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedActivities.length === 0
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 hover:shadow-[var(--shadow-hover)]'
            }`}
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  if (step === 'timeInput') {
    const zone = TIME_ZONES[currentZoneIndex];
    const remainingMinutes = getRemainingMinutes();
    const currentActivityIndex = Object.keys(activityTimes).length;
    const currentActivityId = selectedActivities[currentActivityIndex];
    const currentActivity = ACTIVITY_CARDS.find(a => a.id === currentActivityId);

    if (!currentActivity || remainingMinutes <= 0) {
      return (
        <div className="max-w-lg mx-auto animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800">{zone.emoji} {zone.label} 완료!</h2>
            </div>
            <button
              onClick={completeCurrentZone}
              className="w-full py-4 bg-success text-white rounded-xl font-bold text-lg hover:bg-success/90 hover:shadow-[var(--shadow-hover)] transition-all"
            >
              다음으로
            </button>
          </div>
        </div>
      );
    }

    const [inputMinutes, setInputMinutes] = useState(30);

    const handleConfirm = () => {
      handleTimeInput(currentActivityId, inputMinutes);
    };

    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">남은 시간: {Math.floor(remainingMinutes / 60)}시간 {remainingMinutes % 60}분</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-success h-3 rounded-full transition-all"
                style={{ width: `${((zone.hours * 60 - remainingMinutes) / (zone.hours * 60)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-4">{currentActivity.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800">{currentActivity.label} 얼마나 했어?</h2>
          </div>

          <div className="space-y-4">
            <input
              type="range"
              min="15"
              max={Math.min(remainingMinutes, 180)}
              step="15"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {Math.floor(inputMinutes / 60)}시간 {inputMinutes % 60}분
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setInputMinutes(Math.max(15, inputMinutes - 15))}
                className="flex-1 py-3 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
              >
                -15분
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
              >
                확정
              </button>
              <button
                onClick={() => setInputMinutes(Math.min(remainingMinutes, inputMinutes + 15))}
                className="flex-1 py-3 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
              >
                +15분
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const results = calculateResults();
    const screenTimeMinutes = calculateScreenTime(results);
    const studyTime = results.find(r => r.id === 'study')?.minutes || 0;

    return (
      <div className="max-w-lg mx-auto animate-fade-in space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            🗺️ 어제 너의 시간 지도가 완성됐어!
          </h2>

          <div className="space-y-3">
            {results.slice(0, 6).map(activity => {
              const card = ACTIVITY_CARDS.find(a => a.id === activity.id);
              return (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="text-2xl">{card.emoji}</div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{card.label}</span>
                      <span className="text-sm text-gray-600">{activity.hours}시간 ({activity.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${activity.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-warning/10 border-2 border-warning rounded-2xl p-6">
          <div className="text-center space-y-3">
            <div className="text-4xl">💡</div>
            <h3 className="text-xl font-bold text-gray-800">발견!</h3>
            <p className="text-gray-700">
              스크린 시간 (게임+SNS+유튜브) = {(screenTimeMinutes / 60).toFixed(1)}시간<br />
              공부 시간 = {(studyTime / 60).toFixed(1)}시간
            </p>
            {screenTimeMinutes > studyTime && (
              <p className="text-lg font-bold text-orange-600">
                😮 스크린이 공부보다 {(screenTimeMinutes / studyTime).toFixed(1)}배 많았어!
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            const data = {
              zones: allZoneData,
              results: results,
              sleepHours: calculateSleepHours()
            };
            onComplete(data);
          }}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors"
        >
          다음으로
        </button>
      </div>
    );
  }

  return null;
}
