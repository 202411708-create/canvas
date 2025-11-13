import { useState } from 'react';

export default function FinalScreen({ programData, onRestart }) {
  const [step, setStep] = useState('summary');

  if (step === 'summary') {
    return (
      <div className="max-w-lg mx-auto animate-fade-in space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)] text-center space-y-6 border border-neutral-200">
          <div className="text-7xl">🎊</div>
          <h1 className="text-3xl font-bold text-gray-800">
            오늘 탐험 완료!
          </h1>

          <div className="space-y-4 text-left">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
              오늘 발견한 것:
            </h2>

            <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4 shadow-[var(--shadow-soft)]">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <div className="font-semibold text-gray-800">
                    내가 시간을 어떻게 쓰는지
                  </div>
                  <div className="text-sm text-gray-600">(시간 지도 완성)</div>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-4 shadow-[var(--shadow-soft)]">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <div className="font-semibold text-gray-800">
                    어떤 시간도둑이 있는지
                  </div>
                  <div className="text-sm text-gray-600">(TOP 3 발견)</div>
                </div>
              </div>
            </div>

            <div className="bg-success/10 border-2 border-success/30 rounded-xl p-4 shadow-[var(--shadow-soft)]">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <div className="font-semibold text-gray-800">
                    뭘 바꾸고 싶은지
                  </div>
                  <div className="text-sm text-gray-600">(다짐 작성)</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep('nextSession')}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  if (step === 'nextSession') {
    return (
      <div className="max-w-lg mx-auto animate-fade-in space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)] space-y-6 border border-neutral-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📅 다음 시간에는...
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-warning/10 to-warning/5 border-2 border-warning/30 rounded-xl p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🛡️</div>
                <div>
                  <div className="font-bold text-gray-800">시간도둑을 막는 방법</div>
                  <div className="text-sm text-gray-600">실전 전략 배우기</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-4">
                <div className="text-4xl">⏰</div>
                <div>
                  <div className="font-bold text-gray-800">똑똑한 시간 계획 세우기</div>
                  <div className="text-sm text-gray-600">우선순위 정하기</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/30 rounded-xl p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <div className="font-bold text-gray-800">실제로 실천하는 꿀팁</div>
                  <div className="text-sm text-gray-600">습관 만들기</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border-2 border-primary/40 rounded-xl p-6 text-center shadow-[var(--shadow-soft)]">
            <p className="text-lg font-semibold text-gray-800">
              더 재밌어질 거야! 😊
            </p>
          </div>

          <button
            onClick={() => setStep('final')}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-[var(--shadow-hover)] transition-all"
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  if (step === 'final') {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 rounded-3xl p-10 shadow-[var(--shadow-card)] text-center space-y-8 border border-neutral-300">
          <div className="text-8xl">🕵️</div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">
              오늘 한 다짐,<br />
              잊지 말고 한 번 시도해봐!
            </h1>

            <p className="text-xl text-gray-700">
              안 되더라도 괜찮아.<br />
              다음 시간에 함께 해결하자! 💪
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <p className="text-2xl font-bold text-primary mb-2">
              시간탐정 프로그램 1회기 끝!
            </p>
            <p className="text-gray-600">
              수고했어! 👏
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onRestart}
              className="w-full py-4 bg-white border-2 border-primary text-primary rounded-xl font-bold text-lg hover:bg-primary/10 hover:shadow-[var(--shadow-hover)] transition-all"
            >
              처음부터 다시 하기
            </button>
            <button
              onClick={() => {
                // 데이터 다운로드 또는 출력
                console.log('Program Data:', programData);
                alert('데이터가 콘솔에 출력되었습니다!');
              }}
              className="w-full py-3 bg-neutral-200 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-300 hover:shadow-[var(--shadow-soft)] transition-all"
            >
              📊 내 결과 보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
