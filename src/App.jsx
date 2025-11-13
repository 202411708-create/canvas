import { useState } from 'react';
import Module0_Onboarding from './components/Module0_Onboarding';
import Module1_TimeMap from './components/Module1_TimeMap';
import Module2_TimeThief from './components/Module2_TimeThief';
import Module3_Commitment from './components/Module3_Commitment';
import FinalScreen from './components/FinalScreen';

function App() {
  const [currentModule, setCurrentModule] = useState(0);
  const [programData, setProgramData] = useState({
    timeMap: null,
    timeThieves: null,
    commitment: null
  });

  const updateProgramData = (key, value) => {
    setProgramData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const nextModule = () => {
    setCurrentModule(prev => prev + 1);
  };

  const resetProgram = () => {
    setCurrentModule(0);
    setProgramData({
      timeMap: null,
      timeThieves: null,
      commitment: null
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        {currentModule > 0 && currentModule < 4 && (
          <div className="mb-6 animate-slide-up bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-[var(--shadow-soft)] ${
                      currentModule === num
                        ? 'bg-primary text-white scale-110 shadow-[var(--shadow-hover)]'
                        : currentModule > num
                        ? 'bg-success text-white'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {currentModule > num ? '✓' : num}
                  </div>
                ))}
              </div>
              <span className="text-sm text-neutral-700 font-semibold">
                {currentModule}/3
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-primary to-success h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(currentModule / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Modules */}
        {currentModule === 0 && (
          <Module0_Onboarding onComplete={nextModule} />
        )}

        {currentModule === 1 && (
          <Module1_TimeMap
            onComplete={(data) => {
              updateProgramData('timeMap', data);
              nextModule();
            }}
          />
        )}

        {currentModule === 2 && (
          <Module2_TimeThief
            onComplete={(data) => {
              updateProgramData('timeThieves', data);
              nextModule();
            }}
          />
        )}

        {currentModule === 3 && (
          <Module3_Commitment
            timeThieves={programData.timeThieves}
            onComplete={(data) => {
              updateProgramData('commitment', data);
              nextModule();
            }}
          />
        )}

        {currentModule === 4 && (
          <FinalScreen
            programData={programData}
            onRestart={resetProgram}
          />
        )}
      </div>
    </div>
  );
}

export default App;
