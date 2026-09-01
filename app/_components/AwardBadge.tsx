"use client";
// "고객만족도 1위" 어워드 배지 — 왕관 + 원형 월계수 리스, 메탈릭 골드 그라데이션 SVG.
// 광택(셰인) 띠가 4초마다 배지 전체를 대각선으로 쫙 훑고 지나간다 (마스크 + 이동 그라데이션).
// 히어로 좌상단에 배치. 문구가 실제 텍스트라 광고 심사 크롤러도 읽을 수 있다.
// 리스는 원(중심 70,78 · 반지름 49)을 따라 잎 쌍을 심어 만든다 — 아래는 크고 위로 갈수록 작아지며, 상단은 왕관 자리로 열림.
import { useId } from "react";

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

// 렌즈형 잎 — 기부 (0,0) 에서 +x 방향 길이 L (색은 부모 그룹에서 상속)
function Leaf({ x, y, rot, L }: { x: number; y: number; rot: number; L: number }) {
  return (
    <path
      d={`M0 0 Q ${(L * 0.45).toFixed(1)} ${(-L * 0.3).toFixed(1)} ${L.toFixed(1)} 0 Q ${(L * 0.45).toFixed(1)} ${(L * 0.3).toFixed(1)} 0 0`}
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`}
    />
  );
}

// 한쪽(오른쪽) 가지 — 줄기 호 + 잎 쌍 + 끝 잎. 왼쪽은 scale(-1,1) 미러.
function Branch({ stroke }: { stroke: string }) {
  const [sx, sy] = pt(174);
  const [ex, ey] = pt(24);
  return (
    <>
      <path
        d={`M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${R} ${R} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)}`}
        stroke={stroke}
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

// 배지 도형 일체 (리스 + 왕관 + 문구) — 본체(골드)와 셰인 마스크(흰색)가 같은 도형을 공유한다
function BadgeArt({ paint }: { paint: string }) {
  return (
    <g fill={paint}>
      <Branch stroke={paint} />
      <g transform={`translate(${CX * 2} 0) scale(-1 1)`}>
        <Branch stroke={paint} />
      </g>
      {/* 왕관 — 5포인트 + 보석 밴드 */}
      <path d="M52 28 L54.5 15 L59.8 22.5 L62.5 11 L66.8 20.5 L70 8 L73.2 20.5 L77.5 11 L80.2 22.5 L85.5 15 L88 28 Z" />
      <circle cx="54.5" cy="12.4" r="1.6" />
      <circle cx="62.5" cy="8.4" r="1.7" />
      <circle cx="70" cy="5" r="2.1" />
      <circle cx="77.5" cy="8.4" r="1.7" />
      <circle cx="85.5" cy="12.4" r="1.6" />
      <rect x="51" y="30.2" width="38" height="3.6" rx="1.8" />
      {/* 문구 */}
      <text x="70" y="63" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="0.5" className="serif">
        고객만족도
      </text>
      <text x="70" y="105" textAnchor="middle" fontSize="38" fontWeight="700" className="serif">
        1위
      </text>
    </g>
  );
}

export default function AwardBadge({ className = "" }: { className?: string }) {
  // 배지가 한 페이지에 두 번(모바일·PC) 렌더되므로 id 충돌 방지
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `badgeGold${uid}`;
  const gold = `url(#${gradId})`;
  return (
    <div className={className} role="img" aria-label="고객만족도 1위">
      <svg viewBox="0 0 140 140" aria-hidden className="h-auto w-full">
        <defs>
          {/* 메탈릭 골드 — 어두운 금 → 밝은 하이라이트 → 어두운 금. 광택(셰인)이 배지 전체 위를 천천히 흐른다 */}
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8c6a3a" />
            <stop offset="0.28" stopColor="#c9a35e" />
            <stop offset="0.5" stopColor="#f3e0ae" />
            <stop offset="0.72" stopColor="#c9a35e" />
            <stop offset="1" stopColor="#8c6a3a" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-0.35 0; 0.35 0; -0.35 0"
              dur="5.5s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        {/* 본체 (골드) */}
        <BadgeArt paint={gold} />
        {/* 왕관 밴드의 보석 (배경색 다이아) — 셰인 위에 그려 항상 또렷하게 */}
        <g fill="#f4ede1">
          <path d="M61 30.6 l1.6 1.4 -1.6 1.4 -1.6 -1.4 Z" />
          <path d="M70 30.3 l1.9 1.7 -1.9 1.7 -1.9 -1.7 Z" />
          <path d="M79 30.6 l1.6 1.4 -1.6 1.4 -1.6 -1.4 Z" />
        </g>
      </svg>
    </div>
  );
}
