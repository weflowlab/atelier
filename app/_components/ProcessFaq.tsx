"use client";
// ⑦ 진행 절차 + FAQ 섹션 (#process / #faq) — 5단계 절차 + 신청 CTA, 그 아래 FAQ 아코디언(한 번에 하나만 열림) + 전화 CTA.
// FAQ 는 관리자 페이지(/admin)에서 등록한 DB 목록을 우선 사용, 없거나 실패하면 data.ts 기본 목록.
import { useEffect, useState } from "react";
import { FAQ, PROCESS, SITE } from "../_lib/data";
import Reveal from "./Reveal";

export default function ProcessFaq() {
  const [open, setOpen] = useState<number | null>(0); // 열린 FAQ 인덱스 (첫 항목 기본 오픈)
  const [faqs, setFaqs] = useState(FAQ); // 첫 페인트는 기본 목록(SEO/즉시 표시) → DB 로드 후 교체

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { question: string; answer: string }[]) => {
        if (Array.isArray(rows) && rows.length)
          setFaqs(rows.map((f) => ({ q: f.question, a: f.answer })));
      })
      .catch(() => {}); // DB 미설정/오류 시 기본 목록 유지
  }, []);

  // FAQ 토글: 같은 항목 클릭 시 닫힘, 다른 항목 클릭 시 교체
  const toggle = (i: number) => setOpen((cur) => (cur === i ? null : i));

  return (
    <section id="process" className="scroll-mt-20 bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* ── Part A: 진행 절차 ── */}
        <div>
          <Reveal className="text-center">
            <p className="eyebrow">PROCESS & FAQ</p>
            <h2 className="serif mt-3 text-3xl font-medium tracking-tight md:text-4xl">진행 절차</h2>
            <p className="mt-3 text-sm text-muted">상담 신청부터 시공·A/S 까지 5단계</p>
          </Reveal>
        {/* 5단계: lg 이상 가로 한 줄(사이 연결선 + 쉐브론), 미만 2열 그리드 */}
        <ol className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:flex lg:items-start lg:gap-0">
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} as="li" delay={i * 100} className="relative flex-1 lg:flex lg:items-start">
              <div className="flex flex-col items-center px-2 text-center lg:w-full">
                {/* 단계 번호 원 */}
                <span className="serif flex h-14 w-14 items-center justify-center rounded-full border border-accent bg-surface text-lg text-accent md:h-16 md:w-16">
                  {p.step}
                </span>
                <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted">{p.desc}</p>
              </div>
              {/* 단계 사이 연결 쉐브론 (lg 이상, 마지막 제외) */}
              {i < PROCESS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-7 right-0 hidden translate-x-1/2 items-center text-line lg:flex md:top-8"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </Reveal>
          ))}
        </ol>
        </div>

        {/* ── Part B: FAQ ── */}
        <div id="faq" className="mx-auto mt-24 max-w-3xl scroll-mt-20">
          <Reveal className="text-center">
            <h2 className="serif text-3xl font-medium tracking-tight md:text-4xl">자주 묻는 질문</h2>
            <p className="mt-3 text-sm text-muted">궁금한 점을 확인하세요</p>
          </Reveal>

          {/* 아코디언 — 한 번에 하나만 열림, grid-rows 0fr↔1fr 로 높이 애니메이션 */}
          <Reveal delay={100}>
            <ul className="mt-10 border-t border-line">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={f.q} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-accent"
                    >
                      <span className="flex items-start gap-3 text-sm font-medium md:text-base">
                        <span className="serif shrink-0 text-gold">Q.</span>
                        {f.q}
                      </span>
                      {/* 플러스 → 마이너스: 세로 막대가 회전하며 사라짐 */}
                      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center text-accent">
                        <span className="absolute h-px w-3.5 bg-current" />
                        <span
                          className={`absolute h-3.5 w-px bg-current transition-transform duration-300 ${
                            isOpen ? "rotate-90 scale-y-0" : ""
                          }`}
                        />
                      </span>
                    </button>
                    <div
                      id={`faq-panel-${i}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-5 pl-7">
                          <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{f.a}</p>
                          {/* 지역 목록 — 라벨 열 고정 폭이라 줄바꿈 시 첫 지역명 아래로 정렬(행잉 인덴트) */}
                          {f.list && (
                            <dl className="mt-3 space-y-2">
                              {f.list.map((g) => (
                                <div key={g.label} className="flex gap-3 text-sm leading-relaxed">
                                  <dt className="w-8 shrink-0 font-medium text-foreground/70">{g.label}</dt>
                                  <dd className="flex-1 text-muted">{g.items}</dd>
                                </div>
                              ))}
                            </dl>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* FAQ 하단 CTA — 전화 상담 */}
          <Reveal delay={150} className="mt-12 text-center">
            <p className="text-base text-muted md:text-lg">더 궁금한 점은<br className="md:hidden" /> 전화로 편하게 문의하세요.</p>
            <div className="mx-auto mt-5 flex w-full justify-center">
              <a
                href={SITE.telHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-2 py-3 text-[15px] font-semibold text-foreground transition hover:bg-surface sm:w-auto sm:px-10 sm:py-4 sm:text-base"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" strokeLinejoin="round" />
                </svg>
                <span className="-translate-y-[1px]">전화 상담</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
