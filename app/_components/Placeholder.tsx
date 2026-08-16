// 이미지 자리 표시용 플레이스홀더.
// 실제 이미지가 준비되면 <Image src=... /> 로 교체. `label` 로 어떤 이미지가 들어갈지 표기.
type Props = {
  label?: string;
  className?: string; // 크기/비율은 부모에서 aspect-* 또는 h-* 로 지정
  tone?: "light" | "dark";
};

export default function Placeholder({ label = "IMAGE", className = "", tone = "light" }: Props) {
  const base =
    tone === "dark"
      ? "bg-neutral-800 text-neutral-400 border-neutral-700"
      : "bg-neutral-200 text-neutral-500 border-neutral-300";
  return (
    <div
      aria-hidden
      className={`relative block h-full w-full overflow-hidden border border-dashed ${base} ${className}`}
    >
      {/* 대각선 패턴으로 "빈 이미지" 임을 시각적으로 표시 */}
      <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(45deg,transparent_0_12px,currentColor_12px_13px)]" />
      {/* 라벨은 좌상단 고정 — 위에 얹히는 오버레이 텍스트(히어로/갤러리)와 겹치지 않게 */}
      {label && (
        <span className="absolute left-3 top-3 text-[10px] font-medium tracking-[0.2em] uppercase select-none">
          {label}
        </span>
      )}
      {/* 가운데 안내 문구 — 실제 이미지가 들어갈 자리임을 표시 */}
      <span className="absolute inset-0 flex items-center justify-center px-3 text-center text-xs font-medium tracking-wide select-none sm:text-sm">
        이미지 삽입 예정
      </span>
    </div>
  );
}
