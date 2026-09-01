// "고객만족도 1위" 어워드 배지 — 고객 전달 시안 기반: 왕관 + 원형 월계수 리스, 골드 단색 SVG.
// 히어로 좌상단에 배치. 문구가 실제 텍스트라 광고 심사 크롤러도 읽을 수 있다.
// 리스는 원(중심 70,78 · 반지름 46)을 따라 잎 쌍을 심어 만든다 — 아래는 크고 위로 갈수록 작아지며, 상단은 왕관 자리로 열림.

const CX = 70;
const CY = 78;
const R = 49;

const pt = (deg: number): [number, number] => {
  const t = (deg * Math.PI) / 180;
  return [CX + R * Math.sin(t), CY - R * Math.cos(t)];
};

// 진행 방향(호를 따라 위로 올라가는 접선) 각도 — 잎이 가지 끝 쪽을 향하게
const tangent = (deg: number) => {
  const t = (deg * Math.PI) / 180;
  return (Math.atan2(-Math.sin(t), -Math.cos(t)) * 180) / Math.PI;
};

// 잎 쌍을 심을 위치 (원 위 각도, 12시 기준 시계방향) — 아래(166°)부터 위(30°)까지
const STATIONS: number[] = [];
for (let a = 166; a >= 30; a -= 13.6) STATIONS.push(a);

// 렌즈형 잎 — 기부 (0,0) 에서 +x 방향 길이 L
function Leaf({ x, y, rot, L }: { x: number; y: number; rot: number; L: number }) {
  return (
    <path
      d={`M0 0 Q ${(L * 0.45).toFixed(1)} ${(-L * 0.3).toFixed(1)} ${L.toFixed(1)} 0 Q ${(L * 0.45).toFixed(1)} ${(L * 0.3).toFixed(1)} 0 0`}
      fill="currentColor"
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`}
    />
  );
}

// 반짝이(샤인) — 4방향 다이아 별. 각자 다른 딜레이로 숨쉬듯 깜빡인다
function Sparkle({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  const k = s * 0.18;
  return (
    <path
      d={`M0 ${-s} Q ${k} ${-k} ${s} 0 Q ${k} ${k} 0 ${s} Q ${-k} ${k} ${-s} 0 Q ${-k} ${-k} 0 ${-s} Z`}
      fill="currentColor"
      transform={`translate(${x} ${y})`}
      style={{ animation: `badgeTwinkle 2.4s ease-in-out ${delay}s infinite` }}
    />
  );
}

// 한쪽(오른쪽) 가지 — 줄기 호 + 잎 쌍 + 끝 잎. 왼쪽은 scale(-1,1) 미러.
function Branch() {
  const [sx, sy] = pt(174);
  const [ex, ey] = pt(24);
  return (
    <>
      <path
        d={`M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${R} ${R} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)}`}
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
        fill="none"
      />
      {STATIONS.map((a, i) => {
        const [x, y] = pt(a);
        const phi = tangent(a);
        const L = 14.5 - i * 0.55;
        return (
          <g key={a}>
            <Leaf x={x} y={y} rot={phi - 40} L={L} />
            <Leaf x={x} y={y} rot={phi + 40} L={L} />
          </g>
        );
      })}
      <Leaf x={ex} y={ey} rot={tangent(24)} L={8.5} />
    </>
  );
}

export default function AwardBadge({ className = "" }: { className?: string }) {
  return (
    <div className={className} role="img" aria-label="고객만족도 1위">
      <svg viewBox="0 0 140 140" aria-hidden className="h-auto w-full text-gold">
        <Branch />
        <g transform={`translate(${CX * 2} 0) scale(-1 1)`}>
          <Branch />
        </g>
        {/* 왕관 — 5포인트 + 꼭대기 구슬 + 밴드 보석 (리스 상단 열린 자리) */}
        <g fill="currentColor">
          <path d="M52 28 L54.5 15 L59.8 22.5 L62.5 11 L66.8 20.5 L70 8 L73.2 20.5 L77.5 11 L80.2 22.5 L85.5 15 L88 28 Z" />
          <circle cx="54.5" cy="12.4" r="1.6" />
          <circle cx="62.5" cy="8.4" r="1.7" />
          <circle cx="70" cy="5" r="2.1" />
          <circle cx="77.5" cy="8.4" r="1.7" />
          <circle cx="85.5" cy="12.4" r="1.6" />
          <rect x="51" y="30.2" width="38" height="3.6" rx="1.8" />
        </g>
        {/* 밴드 보석 — 배경과 무관하게 보이도록 어두운 골드 */}
        <g fill="#7a5c3d">
          <path d="M61 30.6 l1.6 1.4 -1.6 1.4 -1.6 -1.4 Z" />
          <path d="M70 30.3 l1.9 1.7 -1.9 1.7 -1.9 -1.7 Z" />
          <path d="M79 30.6 l1.6 1.4 -1.6 1.4 -1.6 -1.4 Z" />
        </g>
        {/* 문구 */}
        <text x="70" y="63" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="0.5" fill="currentColor" className="serif">
          고객만족도
        </text>
        <text x="70" y="105" textAnchor="middle" fontSize="38" fontWeight="700" fill="currentColor" className="serif">
          1위
        </text>
        {/* 반짝이(샤인) — 리스 주변에서 번갈아 깜빡임 */}
        <Sparkle x={25} y={28} s={5} delay={0} />
        <Sparkle x={117} y={35} s={4} delay={0.9} />
        <Sparkle x={16} y={90} s={3.4} delay={1.6} />
        <Sparkle x={124} y={98} s={3} delay={0.5} />
      </svg>
      <style>{`
        @keyframes badgeTwinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          [style*="badgeTwinkle"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
