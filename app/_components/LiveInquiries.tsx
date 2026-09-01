"use client";
// 실시간 상담 문의 보드 (연출용 데이터) — 신뢰 통계 아래 배치.
// 3~7초 랜덤 간격으로 풀(30명)에서 무작위 순서로 새 문의가 위에서 아래로 밀고 들어오고(수직 슬라이드),
// 밀려난 마지막 행은 페이드아웃. 새 행은 1초쯤 옅은 골드로 반짝여 시선을 끈다.
// 목록 높이는 5행으로 고정(--row-h × 5)이라 새 행이 들어와도 페이지가 위아래로 흔들리지 않는다.
// 시간 라벨은 행마다 제각각(서로 겹치지 않는 분 단위)이며, 새 행이 들어올 때 불규칙하게 벌어지고 1분마다 실제로 1씩 늘어난다.
import { useEffect, useRef, useState } from "react";

type Entry = { region: string; name: string; inquiry: string };
type Row = Entry & { id: number; pool: number; minutes: number }; // pool: POOL 인덱스 / minutes: 'N분 전' (0 = 방금 전)

const VISIBLE = 5; // 동시에 보이는 행 수
const INITIAL_MINUTES = [1, 8, 13, 17, 26]; // 첫 화면 시간 (위에서부터, 전부 다르게)

function ageLabel(m: number) {
  if (m <= 0) return "방금 전";
  if (m < 60) return `${m}분 전`;
  return `${Math.floor(m / 60)}시간 전`;
}

// 2~9분 사이 불규칙한 간격 — 행마다 다르게 벌어지도록
const randomGap = () => 2 + Math.floor(Math.random() * 8);

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 연출용 풀 30명 — 서울·경기·인천·강원 지역 × 마스킹 이름 × 상품 문의
const POOL: Entry[] = [
  { region: "서울시 영등포구", name: "정*진", inquiry: "거실 커튼 문의" },
  { region: "송파구 문정동", name: "김*수", inquiry: "블라인드 상담 문의" },
  { region: "강동구 천호동", name: "이*영", inquiry: "암막커튼 문의" },
  { region: "노원구 상계동", name: "박*희", inquiry: "커튼 · 블라인드 견적 문의" },
  { region: "강원도 춘천시", name: "최*민", inquiry: "쉬폰커튼 문의" },
  { region: "마포구 망원동", name: "강*아", inquiry: "침실 암막커튼 문의" },
  { region: "남양주시 다산동", name: "조*현", inquiry: "우드 블라인드 문의" },
  { region: "성남시 분당구", name: "윤*서", inquiry: "로만쉐이드 문의" },
  { region: "광진구 자양동", name: "장*호", inquiry: "무료 방문 실측 신청" },
  { region: "하남시 미사동", name: "임*경", inquiry: "콤비블라인드 문의" },
  { region: "구리시 인창동", name: "한*울", inquiry: "아파트 입주 커튼 문의" },
  { region: "은평구 응암동", name: "오*빈", inquiry: "허니콤 블라인드 문의" },
  { region: "고양시 일산동구", name: "서*연", inquiry: "거실 쉬폰커튼 문의" },
  { region: "중랑구 신내동", name: "신*재", inquiry: "안방 암막커튼 문의" },
  { region: "인천시 송도동", name: "권*지", inquiry: "트리플쉐이드 문의" },
  { region: "용인시 수지구", name: "황*태", inquiry: "커튼 교체 문의" },
  { region: "서초구 방배동", name: "안*솔", inquiry: "전원주택 커튼 문의" },
  { region: "의정부시 민락동", name: "송*미", inquiry: "알루미늄 블라인드 문의" },
  { region: "강남구 역삼동", name: "전*우", inquiry: "린넨커튼 문의" },
  { region: "부천시 중동", name: "홍*란", inquiry: "블라인드 견적 문의" },
  { region: "강서구 마곡동", name: "유*찬", inquiry: "거실 커튼 문의" },
  { region: "수원시 영통구", name: "문*정", inquiry: "블라인드 상담 문의" },
  { region: "성동구 옥수동", name: "양*식", inquiry: "암막커튼 문의" },
  { region: "김포시 장기동", name: "손*혜", inquiry: "커튼 · 블라인드 견적 문의" },
  { region: "파주시 운정동", name: "배*준", inquiry: "쉬폰커튼 문의" },
  { region: "동대문구 전농동", name: "백*하", inquiry: "침실 암막커튼 문의" },
  { region: "강원도 화천군", name: "허*영", inquiry: "우드 블라인드 문의" },
  { region: "양주시 옥정동", name: "남*규", inquiry: "로만쉐이드 문의" },
  { region: "인천시 청라동", name: "심*아", inquiry: "무료 방문 실측 신청" },
  { region: "광명시 철산동", name: "노*원", inquiry: "콤비블라인드 문의" },
];

// 첫 화면은 SSR 과 동일해야 하므로 고정 (풀 앞 5명) — 무작위 순서는 마운트 이후부터
const INITIAL: Row[] = POOL.slice(0, VISIBLE).map((e, i) => ({ ...e, id: i, pool: i, minutes: INITIAL_MINUTES[i] }));

export default function LiveInquiries() {
  const [rows, setRows] = useState<Row[]>(INITIAL);
  const [spinning, setSpinning] = useState(false);
  const queue = useRef<number[]>([]); // 무작위로 섞은 풀 인덱스 큐 — 30명을 다 쓰면 다시 섞는다
  const nextId = useRef(VISIBLE);

  // 3~7초 랜덤 간격으로 새 문의 삽입 (탭 비활성 시 정지).
  // 삽입 직후에는 6행(새 행 + 기존 5행)을 유지해 마지막 행이 페이드아웃할 자리를 주고, 애니메이션이 끝나면 5행으로 정리한다.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let trim: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!document.hidden) {
        setRows((prev) => {
          // 현재 보이는 사람은 제외하고 큐에서 다음 사람을 뽑는다 (같은 사람이 연달아 안 나오게)
          const shown = new Set(prev.map((r) => r.pool));
          let idx: number | undefined;
          for (let guard = 0; guard < 3 && idx === undefined; guard++) {
            if (queue.current.length === 0) queue.current = shuffle(POOL.map((_, i) => i));
            const pos = queue.current.findIndex((i) => !shown.has(i));
            if (pos >= 0) idx = queue.current.splice(pos, 1)[0];
            else queue.current = [];
          }
          const pool = idx ?? 0;
          // 새 행은 '방금 전', 기존 행은 위 행보다 2~9분씩 불규칙하게 뒤로 밀려 전부 다른 시간이 되게
          const next: Row[] = [{ ...POOL[pool], id: nextId.current++, pool, minutes: 0 }];
          for (const r of prev) {
            const above = next[next.length - 1].minutes;
            next.push({ ...r, minutes: Math.max(above + randomGap(), r.minutes + 1) });
          }
          return next.slice(0, VISIBLE + 1);
        });
        setSpinning(true);
        setTimeout(() => setSpinning(false), 700);
        // 슬라이드다운·페이드아웃이 끝난 뒤 밀려난 마지막 행 제거
        clearTimeout(trim);
        trim = setTimeout(() => setRows((prev) => prev.slice(0, VISIBLE)), 700);
      }
      timer = setTimeout(tick, 3000 + Math.random() * 4000);
    };
    timer = setTimeout(tick, 3500);
    return () => {
      clearTimeout(timer);
      clearTimeout(trim);
    };
  }, []);

  // 1분마다 모든 행의 시간이 실제로 1분씩 흐른다 ('방금 전' → '1분 전' → …)
  useEffect(() => {
    const t = setInterval(() => setRows((prev) => prev.map((r) => ({ ...r, minutes: r.minutes + 1 }))), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_6px_24px_rgba(43,37,33,0.06)]">
      {/* 헤더: LIVE 배지 + 업데이트 표시 */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-6">
        <p className="flex items-center gap-2 text-sm font-bold md:text-base">
          <span aria-hidden className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="tracking-[0.12em] text-red-500">LIVE</span>
          지역 커튼 블라인드 문의
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-muted md:text-xs">
          방금 전 업데이트
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden
            className={spinning ? "animate-spin" : ""}
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
          </svg>
        </p>
      </div>

      {/* 목록 — 지역 / 이름(마스킹) 고객님 / 문의 내용 / 시간.
          높이를 5행으로 고정(overflow-hidden)해 새 행이 들어와도 아래 콘텐츠가 밀리지 않는다 */}
      <ul
        aria-label="실시간 상담 문의 목록"
        className="h-[calc(var(--row-h)*5)] overflow-hidden [--row-h:46px] md:[--row-h:52px]"
      >
        {rows.map((r, i) => (
          <li
            key={r.id}
            className={`flex h-[var(--row-h)] items-center gap-3 overflow-hidden border-t border-line/70 px-5 text-[13px] md:gap-6 md:px-6 md:text-sm ${
              i === 0
                ? "animate-[liveRowGrow_0.55s_ease_both,liveRowFlash_1.1s_ease-out_both]"
                : i >= 5
                  ? "animate-[liveRowOut_0.6s_ease_both]"
                  : "transition-opacity"
            }`}
          >
            <span className="flex w-[7.4rem] shrink-0 items-center gap-1.5 md:w-36">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-gold">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="truncate font-semibold">{r.region}</span>
            </span>
            <span className="w-12 shrink-0 text-muted md:w-16">{r.name}</span>
            <span className="min-w-0 flex-1 truncate text-foreground/80">{r.inquiry}</span>
            <span className="shrink-0 text-xs text-muted">{ageLabel(r.minutes)}</span>
          </li>
        ))}
      </ul>

      <style>{`
        /* 새 행: 높이 0 → 한 행 높이로 자라며 아래 행들을 부드럽게 밀어내림 (수직 슬라이드다운) */
        @keyframes liveRowGrow { from { height: 0; opacity: 0.35; } to { height: var(--row-h); opacity: 1; } }
        /* 새 행: 등장 순간 옅은 골드로 1초쯤 반짝인 뒤 원래 배경으로 */
        @keyframes liveRowFlash { 0% { background-color: rgba(184,151,107,0.28); } 100% { background-color: transparent; } }
        /* 밀려난 마지막 행: 창 밖으로 내려가며 페이드아웃 */
        @keyframes liveRowOut { to { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          [class*="liveRow"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
