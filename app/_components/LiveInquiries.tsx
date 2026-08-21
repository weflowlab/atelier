"use client";
// 실시간 상담 문의 보드 (연출용 데이터) — 신뢰 통계 아래 배치.
// 8~15초 간격으로 풀(30명)에서 다음 문의가 맨 위로 슬라이드 인, 기존 행은 시간이 밀려 내려가고 마지막 행 제거.
import { useEffect, useRef, useState } from "react";

type Entry = { region: string; name: string; inquiry: string };
type Row = Entry & { id: number };

// 표시 시간 — 행 위치별 고정 라벨 (위에서부터)
const AGE_LABELS = ["방금 전", "1분 전", "3분 전", "8분 전", "10분 전"];

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
  { region: "남양주시 별내동", name: "유*찬", inquiry: "거실 커튼 문의" },
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

const INITIAL: Row[] = POOL.slice(0, 5).map((e, i) => ({ ...e, id: i }));

export default function LiveInquiries() {
  const [rows, setRows] = useState<Row[]>(INITIAL);
  const [spinning, setSpinning] = useState(false);
  const poolIdx = useRef(5); // 다음에 등장할 풀 인덱스 (순환)
  const nextId = useRef(5);

  // 8~15초 랜덤 간격으로 새 문의 삽입 (탭 비활성 시 정지)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!document.hidden) {
        setRows((prev) => {
          const entry = POOL[poolIdx.current % POOL.length];
          poolIdx.current++;
          return [{ ...entry, id: nextId.current++ }, ...prev].slice(0, 5);
        });
        setSpinning(true);
        setTimeout(() => setSpinning(false), 700);
      }
      timer = setTimeout(tick, 8000 + Math.random() * 7000);
    };
    timer = setTimeout(tick, 6000);
    return () => clearTimeout(timer);
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

      {/* 목록 — 지역 / 이름(마스킹) 고객님 / 문의 내용 / 시간 */}
      <ul aria-label="실시간 상담 문의 목록">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className={`flex items-center gap-3 border-t border-line/70 px-5 py-3 text-[13px] md:gap-6 md:px-6 md:py-3.5 md:text-sm ${
              i === 0 ? "animate-[liveRowIn_0.5s_ease]" : ""
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
            <span className="shrink-0 text-xs text-muted">{AGE_LABELS[i]}</span>
          </li>
        ))}
      </ul>

      <style>{`
        @keyframes liveRowIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          [class*="liveRowIn"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
