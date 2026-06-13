import React, { useMemo } from 'react';

// Color map for wrapping papers
const WRAP_COLORS = {
  'Classic Kraft Paper': { bg: '#D7CCC8', border: '#8D6E63', label: 'Kraft Brown' },
  'Rustic Burlap': { bg: '#E0D4C3', border: '#A1887F', label: 'Burlap Beige' },
  'Elegant Pink Crepe': { bg: '#F8BBD0', border: '#C2185B', label: 'Pink Crepe' },
  'Soft White Mesh': { bg: '#ECEFF1', border: '#B0BEC5', label: 'White Mesh' },
  'Lavender Dream': { bg: '#E1BEE7', border: '#7B1FA2', label: 'Lavender Violet' }
};

// Flower visual metadata mapping
const FLOWER_VISUALS = {
  'Red Rose': { color: '#E53935', leaf: '#2E7D32', type: 'rose' },
  'Pink Rose': { color: '#EC407A', leaf: '#2E7D32', type: 'rose' },
  'White Tulip': { color: '#F5F5F5', leaf: '#81C784', type: 'tulip' },
  'Yellow Tulip': { color: '#FDD835', leaf: '#81C784', type: 'tulip' },
  'Stargazer Lily': { color: '#F06292', leaf: '#388E3C', type: 'lily' },
  'Sweet Lavender': { color: '#9575CD', leaf: '#4CAF50', type: 'lavender' },
  'Bright Sunflower': { color: '#FFB300', leaf: '#388E3C', type: 'sunflower' },
  'Blue Hydrangea': { color: '#4FC3F7', leaf: '#4CAF50', type: 'hydrangea' },
  'Pink Carnation': { color: '#F48FB1', leaf: '#81C784', type: 'carnation' }
};

export default function BouquetCanvas({ items = [], wrapping = 'Classic Kraft Paper', size = 'Medium' }) {
  // Determine scale factor based on bouquet size
  const scale = size === 'Small' ? 0.75 : size === 'Medium' ? 1.0 : 1.25;

  // Flatten the items list into individual stems to draw
  const stems = useMemo(() => {
    const arr = [];
    items.forEach(item => {
      const visual = FLOWER_VISUALS[item.name] || { color: '#B0BEC5', leaf: '#78909C', type: 'default' };
      for (let i = 0; i < item.qty; i++) {
        arr.push({
          name: item.name,
          ...visual,
          // Generate deterministic pseudo-random angles and positions so the bouquet doesn't shift on every render
          // but looks naturally scattered.
          seed: Math.sin(arr.length + 1)
        });
      }
    });
    return arr;
  }, [items]);

  const wrapColor = WRAP_COLORS[wrapping] || WRAP_COLORS['Classic Kraft Paper'];

  // Render specific flower shapes
  const renderFlowerHead = (type, color, x, y, size = 15) => {
    switch (type) {
      case 'rose':
        return (
          <g>
            {/* outer petals */}
            <circle cx={x} cy={y} r={size} fill={color} />
            <circle cx={x - 4} cy={y - 2} r={size * 0.7} fill="rgba(0,0,0,0.1)" />
            {/* rose spirals */}
            <path d={`M ${x-6} ${y-4} Q ${x} ${y-10} ${x+6} ${y-4} Q ${x+10} ${y+4} ${x} ${y+8} Q ${x-10} ${y+4} ${x-6} ${y-4}`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <circle cx={x} cy={y} r={size * 0.4} fill="rgba(0,0,0,0.15)" />
            <circle cx={x} cy={y} r={size * 0.2} fill={color} />
          </g>
        );
      case 'tulip':
        return (
          <g>
            {/* Tulip cup shape */}
            <path d={`M ${x - size} ${y} C ${x - size} ${y - size}, ${x - size * 0.3} ${y - size * 1.3}, ${x} ${y - size} C ${x + size * 0.3} ${y - size * 1.3}, ${x + size} ${y - size}, ${x + size} ${y} Z`} fill={color} />
            <path d={`M ${x - size * 0.5} ${y + size * 0.2} C ${x - size * 0.7} ${y - size * 0.8}, ${x} ${y - size * 1.1}, ${x} ${y - size * 0.2}`} fill="rgba(0,0,0,0.1)" />
          </g>
        );
      case 'lily':
        return (
          <g>
            {/* Starlike petals */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <path
                key={i}
                d={`M ${x} ${y} Q ${x - size*0.4} ${y - size}, ${x} ${y - size*1.4} Q ${x + size*0.4} ${y - size}, ${x} ${y} Z`}
                fill={color}
                transform={`rotate(${angle}, ${x}, ${y})`}
              />
            ))}
            {/* Lily center */}
            <circle cx={x} cy={y} r={size * 0.25} fill="#FFF9C4" />
            <circle cx={x} cy={y} r={size * 0.1} fill="#E65100" />
          </g>
        );
      case 'sunflower':
        return (
          <g>
            {/* Yellow petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <ellipse
                key={i}
                cx={x}
                cy={y - size * 0.9}
                rx={size * 0.25}
                ry={size * 0.7}
                fill={color}
                transform={`rotate(${angle}, ${x}, ${y})`}
              />
            ))}
            {/* Dark center seed disk */}
            <circle cx={x} cy={y} r={size * 0.65} fill="#3E2723" />
            <circle cx={x} cy={y} r={size * 0.5} fill="#4E342E" stroke="#5D4037" strokeWidth="1" strokeDasharray="2,2" />
          </g>
        );
      case 'lavender':
        return (
          <g>
            {/* Stalk of lavender buds */}
            <line x1={x} y1={y} x2={x} y2={y - size*1.5} stroke={color} strokeWidth="2" />
            {[-15, -5, 5, 15, 25].map((offsetY, i) => (
              <g key={i}>
                <circle cx={x - 4} cy={y - size + offsetY} r="3.5" fill={color} />
                <circle cx={x + 4} cy={y - size + offsetY} r="3.5" fill={color} />
                <circle cx={x} cy={y - size + offsetY - 3} r="3" fill="#D1C4E9" />
              </g>
            ))}
          </g>
        );
      case 'hydrangea':
        return (
          <g>
            {/* Clustered fluffy circle */}
            <circle cx={x} cy={y} r={size * 1.4} fill={color} opacity="0.4" />
            {/* little mini flowers inside cluster */}
            {[
              {dx: 0, dy: 0}, {dx: -10, dy: -6}, {dx: 10, dy: -6},
              {dx: -8, dy: 8}, {dx: 8, dy: 8}, {dx: 0, dy: -12},
              {dx: -14, dy: 2}, {dx: 14, dy: 2}
            ].map((pt, i) => (
              <circle key={i} cx={x + pt.dx} cy={y + pt.dy} r="5" fill="#E1F5FE" stroke={color} strokeWidth="1.5" />
            ))}
          </g>
        );
      case 'carnation':
        return (
          <g>
            {/* Frilly ruffled circles stacked */}
            <circle cx={x} cy={y} r={size} fill={color} />
            <circle cx={x} cy={y} r={size * 0.8} fill={color} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="3,2" />
            <circle cx={x} cy={y} r={size * 0.6} fill={color} stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <circle cx={x} cy={y} r={size * 0.3} fill="#F8BBD0" />
          </g>
        );
      default:
        return <circle cx={x} cy={y} r={size} fill={color} />;
    }
  };

  return (
    <div className="builder-canvas-container" style={{ width: '100%' }}>
      {stems.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--color-text-sub)', padding: '24px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🧺</span>
          <h3>Your Bouquet is Empty</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Select flowers from the menu to start designing your custom arrangement.</p>
        </div>
      ) : (
        <>
          <svg className="bouquet-svg-elem" viewBox="0 0 400 400" fill="none">
            {/* 1. Stems Layer */}
            <g id="stems-layer" transform={`translate(200, 250) scale(${scale}) translate(-200, -250)`}>
              {stems.map((s, idx) => {
                // Spread stems out in a fan-shape
                // Angle between -35 and +35 degrees
                const angle = s.seed * 35;
                const radians = (angle * Math.PI) / 180;
                const endX = 200 + Math.sin(radians) * 160;
                const endY = 220 - Math.cos(radians) * 110;
                
                return (
                  <g key={idx}>
                    {/* Stem line */}
                    <path
                      d={`M 200 320 Q ${200 + Math.sin(radians) * 80} ${280 - Math.cos(radians) * 40}, ${endX} ${endY}`}
                      stroke={s.leaf}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Stem leaves */}
                    {Math.abs(angle) > 5 && (
                      <path
                        d={`M ${200 + Math.sin(radians)*60} ${290 - Math.cos(radians)*30} Q ${200 + Math.sin(radians)*60 + (angle > 0 ? 15 : -15)} ${270 - Math.cos(radians)*30}, ${200 + Math.sin(radians)*75} ${260 - Math.cos(radians)*35}`}
                        fill={s.leaf}
                      />
                    )}
                  </g>
                );
              })}
            </g>

            {/* 2. Wrapping Paper Back (Behind Flower Heads) */}
            <g id="wrapping-paper-back" transform={`translate(200, 250) scale(${scale}) translate(-200, -250)`}>
              {/* Fan cone background representing the wrapping paper cavity */}
              <path
                d="M 200 340 L 90 190 C 120 160, 280 160, 310 190 Z"
                fill={wrapColor.bg}
                stroke={wrapColor.border}
                strokeWidth="1"
                opacity="0.85"
              />
            </g>

            {/* 3. Flower Heads Layer */}
            <g id="flower-heads-layer" transform={`translate(200, 250) scale(${scale}) translate(-200, -250)`}>
              {stems.map((s, idx) => {
                // Match the stem endpoint coordinates
                const angle = s.seed * 35;
                const radians = (angle * Math.PI) / 180;
                
                // Add some height layering (some flowers taller than others)
                const heightOffset = 110 + (s.seed * s.seed * 25);
                const flowerX = 200 + Math.sin(radians) * 160;
                const flowerY = 220 - Math.cos(radians) * heightOffset;
                
                // Slightly vary the flower diameter
                const size = 15 + (Math.abs(s.seed) * 5);

                return (
                  <g key={idx}>
                    {renderFlowerHead(s.type, s.color, flowerX, flowerY, size)}
                  </g>
                );
              })}
            </g>

            {/* 4. Wrapping Paper Front (In Front of Stems, holding it together) */}
            <g id="wrapping-paper-front" transform={`translate(200, 250) scale(${scale}) translate(-200, -250)`}>
              {/* Wrapping paper overlapping fold */}
              <path
                d="M 200 350 L 110 210 Q 200 240 290 210 L 200 350 Z"
                fill={wrapColor.bg}
                stroke={wrapColor.border}
                strokeWidth="2"
                shadow-box="0 4px 10px rgba(0,0,0,0.15)"
              />
              
              {/* Wrapping paper ribbon/tie bow */}
              <g id="ribbon-bow" transform="translate(200, 310)">
                <ellipse cx="0" cy="0" rx="20" ry="8" fill="var(--color-rose-dark)" opacity="0.95" />
                {/* Bow wings */}
                <path d="M 0 0 C -15 -15, -25 -10, -20 0 C -25 10, -15 15, 0 0" fill="var(--color-rose-dark)" />
                <path d="M 0 0 C 15 -15, 25 -10, 20 0 C 25 10, 15 15, 0 0" fill="var(--color-rose-dark)" />
                {/* Ribbon tails */}
                <path d="M -5 0 Q -15 20 -10 32" stroke="var(--color-rose-dark)" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 5 0 Q 15 20 12 32" stroke="var(--color-rose-dark)" strokeWidth="3" strokeLinecap="round" fill="none" />
                {/* Bow knot */}
                <circle cx="0" cy="0" r="5" fill="#FF80AB" />
              </g>
            </g>
          </svg>

          {/* Ribbon details overlay */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--color-border)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'var(--color-text-main)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            💐 {size} Size • {wrapping}
          </div>
        </>
      )}
    </div>
  );
}
