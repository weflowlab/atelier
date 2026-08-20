// 히어로 바로 아래 신뢰 밴드 — 좌우 월계수 장식 + "수많은 고객이 선택한 커튼장인" / 경력·누적 시공 강조 한 줄.
import { SITE } from "../_lib/data";

// 스타일라이즈드 월계수 가지 (줄기 + 잎). flip 으로 좌우 대칭.
const LEAVES: [number, number, number][] = [
  [11, 66, -40], [24, 60, 30], [9, 52, -45], [22, 45, 25],
  [8, 37, -50], [21, 30, 20], [9, 22, -55], [19, 15, 15], [13, 8, -60],
];

function Laurel({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 80"
      aria-hidden
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M26 76 C13 62 9 42 14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {LEAVES.map(([x, y, a]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="6" ry="2.4" fill="currentColor" transform={`rotate(${a} ${x} ${y})`} />
      ))}
    </svg>
  );
}

export default function TrustBand() {
  return (
    <section aria-label="커튼장인 신뢰 지표" className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 px-5 py-6 text-center sm:gap-8 md:py-10">
        <Laurel className="h-24 w-8 shrink-0 text-gold md:h-28 md:w-10" />
        <div className="min-w-0">
          <p className="serif text-[13px] tracking-[0.14em] text-gold md:text-[15px]">수많은 고객이 선택한 {SITE.nameKo}</p>
          <p className="serif mt-3 text-[21px] font-semibold leading-snug text-foreground md:text-3xl">
            {SITE.careerYears}년 경력 · 누적 시공 10,000건 이상
          </p>
          <p className="mt-3 text-sm text-muted md:text-base">고객의 공간을 가장 아름답게 완성합니다</p>
        </div>
        <Laurel flip className="h-24 w-8 shrink-0 text-gold md:h-28 md:w-10" />
      </div>
    </section>
  );
}
