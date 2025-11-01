import { useState } from 'react';
import { RotateCcw, BookOpen, Paintbrush } from 'lucide-react';

export default function DigitalCollageMotivator() {
  // 페이지 모드: 'collage' 또는 'texture'
  const [pageMode, setPageMode] = useState('collage');

  // 학생이 추가한 도형들
  const [shapes, setShapes] = useState([]);

  // 현재 선택된 색상
  const [selectedColor, setSelectedColor] = useState('#FF3333');

  // 질감 학습 - 현재 선택된 질감
  const [activeTexture, setActiveTexture] = useState(null);

  // 드래그 관련 state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 간이 캔버스 자유 드로잉 관련 state
  const [selectionPath, setSelectionPath] = useState([]);
  const [isDrawingSelection, setIsDrawingSelection] = useState(false);
  const [completedSelection, setCompletedSelection] = useState(null);
  const [cutoutPaths, setCutoutPaths] = useState([]);

  // 색상 팔레트
  const colors = [
    { name: '빨강', hex: '#FF3333' },
    { name: '파랑', hex: '#0066FF' },
    { name: '노랑', hex: '#FFD700' },
    { name: '초록', hex: '#00CC44' },
    { name: '보라', hex: '#9933FF' },
    { name: '주황', hex: '#FF8800' }
  ];

  // 질감 학습 데이터
  const textureTypes = [
    {
      id: 'rough',
      name: '거칠다',
      emoji: '🪵',
      color: '#8B4513',
      pattern: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 3px)',
      patternSize: '5px 5px',
      animation: 'shake',
      shadow: '0 3px 6px rgba(0,0,0,0.2)'
    },
    {
      id: 'soft',
      name: '부드럽다',
      emoji: '☁️',
      color: '#E8F4F8',
      pattern: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 30%, transparent 70%)',
      patternSize: '40px 40px',
      animation: 'float',
      shadow: '0 8px 16px rgba(0,0,0,0.1)'
    },
    {
      id: 'smooth',
      name: '매끄럽다',
      emoji: '🧊',
      color: '#B8E6F0',
      pattern: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%, rgba(255,255,255,0.3) 100%)',
      patternSize: 'cover',
      animation: 'shine',
      shadow: '0 4px 12px rgba(0,150,200,0.3)'
    },
    {
      id: 'fluffy',
      name: '푹신하다',
      emoji: '🛏️',
      color: '#FFD6E8',
      pattern: 'radial-gradient(circle, rgba(255,255,255,0.5) 40%, transparent 70%)',
      patternSize: '30px 30px',
      animation: 'bounce',
      shadow: '0 6px 15px rgba(0,0,0,0.15)'
    },
    {
      id: 'hard',
      name: '단단하다',
      emoji: '🪨',
      color: '#696969',
      pattern: 'none',
      patternSize: 'auto',
      animation: 'pulse',
      shadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
    },
    {
      id: 'squishy',
      name: '말랑말랑하다',
      emoji: '🍮',
      color: '#FFEAA7',
      pattern: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.6), transparent)',
      patternSize: 'cover',
      animation: 'wiggle',
      shadow: '0 5px 10px rgba(0,0,0,0.2)'
    }
  ];

  // 간이 캔버스 선택 영역 그리기 시작
  const handleSelectionDrawStart = (e) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setIsDrawingSelection(true);
    setSelectionPath([{ x, y }]);
    setCompletedSelection(null);
  };

  const handleSelectionDrawMove = (e) => {
    if (!isDrawingSelection) return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setSelectionPath(prev => [...prev, { x, y }]);
  };

  const handleSelectionDrawEnd = () => {
    if (selectionPath.length > 10) {
      setCompletedSelection([...selectionPath, selectionPath[0]]);
    }
    setIsDrawingSelection(false);
  };

  const clearMiniCanvas = () => {
    setSelectionPath([]);
    setCompletedSelection(null);
    setCutoutPaths([]);
  };

  const addShapeToMainCanvas = () => {
    if (!completedSelection) return;

    setCutoutPaths(prev => [...prev, completedSelection]);

    const newShape = {
      id: Date.now(),
      type: 'cutout',
      path: completedSelection,
      color: selectedColor,
      x: 50,
      y: 50
    };

    setShapes([...shapes, newShape]);
    setCompletedSelection(null);
    setSelectionPath([]);
  };

  const handleShapeDragStart = (e, shape) => {
    e.stopPropagation();
    setDraggingId(shape.id);

    const canvas = document.querySelector('.main-canvas-area');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    setDragOffset({
      x: clientX - rect.left - (shape.x * rect.width / 100),
      y: clientY - rect.top - (shape.y * rect.height / 100)
    });
  };

  const handleShapeDragMove = (e) => {
    if (!draggingId) return;

    const canvas = document.querySelector('.main-canvas-area');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const newX = ((clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const newY = ((clientY - rect.top - dragOffset.y) / rect.height) * 100;

    setShapes(shapes.map(s =>
      s.id === draggingId
        ? { ...s, x: Math.max(10, Math.min(90, newX)), y: Math.max(10, Math.min(90, newY)) }
        : s
    ));
  };

  const handleShapeDragEnd = () => {
    setDraggingId(null);
  };

  const createSVGPath = (points) => {
    if (points.length === 0) return '';

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path + ' Z';
  };

  const renderMiniCanvas = () => {
    return (
      <div
        className="mini-canvas"
        style={{
          position: 'relative',
          width: '100%',
          height: '250px',
          backgroundColor: selectedColor,
          border: '3px solid #cbd5e0',
          borderRadius: '8px',
          cursor: 'crosshair',
          touchAction: 'none',
          overflow: 'hidden'
        }}
        onMouseDown={handleSelectionDrawStart}
        onMouseMove={handleSelectionDrawMove}
        onMouseUp={handleSelectionDrawEnd}
        onMouseLeave={handleSelectionDrawEnd}
        onTouchStart={handleSelectionDrawStart}
        onTouchMove={handleSelectionDrawMove}
        onTouchEnd={handleSelectionDrawEnd}
      >
        {!completedSelection && selectionPath.length === 0 && cutoutPaths.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ffffff',
            fontSize: '1.8rem',
            fontWeight: '700',
            pointerEvents: 'none',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap'
          }}>
            여기에 그려보세요
          </div>
        )}

        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {cutoutPaths.map((path, index) => (
            <path
              key={`cutout-${index}`}
              d={createSVGPath(path)}
              fill="white"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="2"
            />
          ))}

          {selectionPath.length > 0 && (
            <path
              d={createSVGPath([...selectionPath, selectionPath[0]])}
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {completedSelection && (
            <>
              <path
                d={createSVGPath(completedSelection)}
                stroke="white"
                strokeWidth="4"
                fill="rgba(0,0,0,0.3)"
                strokeDasharray="8,4"
              />
              <path
                d={createSVGPath(completedSelection)}
                stroke="black"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8,4"
              />
            </>
          )}
        </svg>
      </div>
    );
  };

  const renderMainCanvasShape = (shape) => {
    const containerStyle = {
      position: 'absolute',
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      transform: 'translate(-50%, -50%)',
      cursor: draggingId === shape.id ? 'grabbing' : 'grab',
      touchAction: 'none',
      userSelect: 'none'
    };

    return (
      <div
        key={shape.id}
        className="main-canvas-shape"
        style={containerStyle}
        onMouseDown={(e) => handleShapeDragStart(e, shape)}
        onTouchStart={(e) => handleShapeDragStart(e, shape)}
      >
        <svg width="300" height="300" style={{ overflow: 'visible' }}>
          <path
            d={createSVGPath(shape.path)}
            fill={shape.color}
            stroke={shape.color}
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  };

  const renderCollagePage = () => (
    <div className="collage-container">
      <style>{`
        .collage-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .collage-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .mini-canvas {
            height: 200px !important;
          }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            marginBottom: '15px',
            color: '#1a202c',
            fontSize: '1.3rem',
            fontWeight: '800'
          }}>
            1단계: 색 선택하기
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {colors.map(color => (
              <button
                key={color.hex}
                onClick={() => {
                  setSelectedColor(color.hex);
                  setCutoutPaths([]);
                }}
                style={{
                  padding: '0',
                  width: '100%',
                  height: '70px',
                  backgroundColor: color.hex,
                  border: selectedColor === color.hex ? '5px solid #2d3748' : '3px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: selectedColor === color.hex ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedColor === color.hex ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.1)'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            marginBottom: '15px',
            color: '#1a202c',
            fontSize: '1.3rem',
            fontWeight: '800'
          }}>
            2단계: 모양 그리기
          </h3>
          {renderMiniCanvas()}
          <button
            onClick={clearMiniCanvas}
            style={{
              marginTop: '10px',
              padding: '10px',
              width: '100%',
              backgroundColor: '#f3f4f6',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: '#374151',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          >
            🗑️ 지우기
          </button>
        </div>

        <button
          onClick={addShapeToMainCanvas}
          disabled={!completedSelection}
          style={{
            padding: '20px',
            backgroundColor: !completedSelection ? '#9ca3af' : '#22c55e',
            border: '3px solid ' + (!completedSelection ? '#6b7280' : '#16a34a'),
            borderRadius: '12px',
            cursor: !completedSelection ? 'not-allowed' : 'pointer',
            fontSize: '1.4rem',
            fontWeight: '900',
            color: 'white',
            boxShadow: !completedSelection ? 'none' : '0 6px 16px rgba(34, 197, 94, 0.5)',
            transition: 'all 0.2s',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            opacity: !completedSelection ? 0.5 : 1
          }}
          onMouseOver={(e) => {
            if (completedSelection) {
              e.target.style.backgroundColor = '#16a34a';
              e.target.style.transform = 'scale(1.02)';
            }
          }}
          onMouseOut={(e) => {
            if (completedSelection) {
              e.target.style.backgroundColor = '#22c55e';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          ➕ 도형 추가하기
        </button>

        <button
          onClick={() => setShapes([])}
          style={{
            padding: '18px',
            backgroundColor: '#ef4444',
            border: '3px solid #dc2626',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: '900',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#ef4444';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <RotateCcw size={22} />
          다시 시작하기
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          marginBottom: '15px',
          color: '#1a202c',
          fontSize: '1.8rem',
          fontWeight: '900'
        }}>
          내 작품 캔버스
        </h3>
        <style>{`
          .main-canvas-area {
            position: relative;
            width: 100%;
            height: 600px;
            background-color: #ffffff;
            border: 4px dashed #c7d2fe;
            border-radius: 8px;
            overflow: hidden;
          }

          @media (max-width: 1024px) {
            .main-canvas-area {
              height: 500px;
            }
          }

          @media (max-width: 768px) {
            .main-canvas-area {
              height: 400px;
            }
          }
        `}</style>
        <div
          className="main-canvas-area"
          onMouseMove={handleShapeDragMove}
          onMouseUp={handleShapeDragEnd}
          onMouseLeave={handleShapeDragEnd}
          onTouchMove={handleShapeDragMove}
          onTouchEnd={handleShapeDragEnd}
        >
          {shapes.map((shape) => renderMainCanvasShape(shape))}
        </div>
      </div>
    </div>
  );

  const renderTexturePage = () => (
    <div style={{ position: 'relative', minHeight: '600px' }}>
      <style>
        {`
          @keyframes texture-float {
            0% {
              transform: translate(-50%, -50%) scale(3.5);
            }
            50% {
              transform: translate(-50%, calc(-50% - 40px)) scale(3.5);
            }
            100% {
              transform: translate(-50%, -50%) scale(3.5);
            }
          }

          @keyframes texture-bounce {
            0% {
              transform: translate(-50%, -50%) scale(3.5);
            }
            50% {
              transform: translate(-50%, -50%) scale(2.8);
            }
            100% {
              transform: translate(-50%, -50%) scale(3.5);
            }
          }

          @keyframes texture-wiggle {
            0% {
              transform: translate(-50%, -50%) scale(3.5) rotate(0deg);
            }
            25% {
              transform: translate(-50%, -50%) scale(3.5) rotate(-20deg);
            }
            50% {
              transform: translate(-50%, -50%) scale(3.5) rotate(0deg);
            }
            75% {
              transform: translate(-50%, -50%) scale(3.5) rotate(20deg);
            }
            100% {
              transform: translate(-50%, -50%) scale(3.5) rotate(0deg);
            }
          }

          @keyframes texture-shake {
            0% {
              transform: translate(-50%, -50%) scale(3.5);
            }
            10% {
              transform: translate(calc(-50% - 20px), -50%) scale(3.5);
            }
            20% {
              transform: translate(calc(-50% + 20px), -50%) scale(3.5);
            }
            30% {
              transform: translate(calc(-50% - 20px), -50%) scale(3.5);
            }
            40% {
              transform: translate(calc(-50% + 20px), -50%) scale(3.5);
            }
            50% {
              transform: translate(calc(-50% - 20px), -50%) scale(3.5);
            }
            60% {
              transform: translate(calc(-50% + 20px), -50%) scale(3.5);
            }
            70% {
              transform: translate(calc(-50% - 20px), -50%) scale(3.5);
            }
            80% {
              transform: translate(calc(-50% + 20px), -50%) scale(3.5);
            }
            90% {
              transform: translate(calc(-50% - 20px), -50%) scale(3.5);
            }
            100% {
              transform: translate(-50%, -50%) scale(3.5);
            }
          }

          @keyframes texture-shine {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }

          @keyframes texture-pulse {
            0% {
              transform: translate(-50%, -50%) scale(3.5);
            }
            50% {
              transform: translate(-50%, -50%) scale(3.7);
            }
            100% {
              transform: translate(-50%, -50%) scale(3.5);
            }
          }

          .texture-card {
            transition: all 0.3s ease;
          }

          .texture-card:hover:not(.expanded) {
            transform: scale(1.05);
          }

          .texture-card.expanded {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            z-index: 100 !important;
            margin: 0 !important;
            transform: translate(-50%, -50%) scale(3.5);
          }

          .texture-card.expanded.float {
            animation: texture-float 1.2s ease-in-out infinite !important;
          }

          .texture-card.expanded.bounce {
            animation: texture-bounce 0.6s ease-in-out infinite !important;
          }

          .texture-card.expanded.wiggle {
            animation: texture-wiggle 0.8s ease-in-out infinite !important;
          }

          .texture-card.expanded.shake {
            animation: texture-shake 0.5s ease-in-out infinite !important;
          }

          .texture-card.expanded.shine {
            transform: translate(-50%, -50%) scale(3.5) !important;
            animation: texture-shine 1.5s linear infinite !important;
            background-size: 200% auto !important;
          }

          .texture-card.expanded.pulse {
            animation: texture-pulse 1.5s ease-in-out infinite !important;
          }

          .texture-card.hidden {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }
        `}
      </style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '25px',
        padding: '20px'
      }}>
        {textureTypes.map(texture => {
          const isExpanded = activeTexture === texture.id;
          const isHidden = activeTexture && activeTexture !== texture.id;

          const baseStyle = {
            backgroundColor: texture.color,
            backgroundImage: texture.pattern,
            backgroundSize: texture.patternSize,
            padding: '40px',
            borderRadius: '16px',
            cursor: 'pointer',
            boxShadow: texture.shadow,
            textAlign: 'center',
            border: isExpanded ? '4px solid #2d3748' : '2px solid #e2e8f0',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px'
          };

          return (
            <div
              key={texture.id}
              className={`texture-card ${
                isExpanded ? `expanded ${texture.animation}` : ''
              } ${
                isHidden ? 'hidden' : ''
              }`}
              onClick={() => setActiveTexture(isExpanded ? null : texture.id)}
              style={baseStyle}
            >
              <div style={{ fontSize: '4rem' }}>
                {texture.emoji}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#2d3748',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
              }}>
                {texture.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#FFF8F0',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => setPageMode('collage')}
          style={{
            padding: '18px 35px',
            backgroundColor: pageMode === 'collage' ? '#2563eb' : '#e5e7eb',
            border: pageMode === 'collage' ? '4px solid #1e40af' : '3px solid #d1d5db',
            borderRadius: '14px',
            cursor: 'pointer',
            fontSize: '1.3rem',
            fontWeight: '900',
            color: pageMode === 'collage' ? 'white' : '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            boxShadow: pageMode === 'collage' ? '0 6px 16px rgba(37, 99, 235, 0.4)' : '0 2px 6px rgba(0,0,0,0.1)',
            textShadow: pageMode === 'collage' ? '1px 1px 3px rgba(0,0,0,0.3)' : 'none'
          }}
        >
          <Paintbrush size={28} />
          콜라주 만들기
        </button>
        <button
          onClick={() => setPageMode('texture')}
          style={{
            padding: '18px 35px',
            backgroundColor: pageMode === 'texture' ? '#7c3aed' : '#e5e7eb',
            border: pageMode === 'texture' ? '4px solid #6d28d9' : '3px solid #d1d5db',
            borderRadius: '14px',
            cursor: 'pointer',
            fontSize: '1.3rem',
            fontWeight: '900',
            color: pageMode === 'texture' ? 'white' : '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            boxShadow: pageMode === 'texture' ? '0 6px 16px rgba(124, 58, 237, 0.4)' : '0 2px 6px rgba(0,0,0,0.1)',
            textShadow: pageMode === 'texture' ? '1px 1px 3px rgba(0,0,0,0.3)' : 'none'
          }}
        >
          <BookOpen size={28} />
          질감 학습하기
        </button>
      </div>

      {pageMode === 'collage' ? renderCollagePage() : renderTexturePage()}
    </div>
  );
}
