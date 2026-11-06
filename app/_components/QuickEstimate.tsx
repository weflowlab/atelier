"use client";
// 간편 견적 — 성함·연락처·개인정보 동의만 받는 짧은 신청 카드.
// 히어로(PC 우측 패널 / 모바일은 히어로 바로 아래)와 페이지 중간 섹션에 들어간다. 상세 신청은 하단 4단계 폼(EstimateForm).
// 전송·저장·전환 이벤트는 4단계 폼과 같은 경로(sendLead → submitLead)를 쓴다.
import { useState, useTransition, type FormEvent } from "react";
import { FORM_SUCCESS, PRODUCT_TYPE_OPTIONS } from "../_lib/data";
import { getAttribution, getEntryKeyword } from "../_lib/attribution";
import { matchKeyword } from "../_lib/keywords";
import { matchProductOption } from "../_lib/formEvents";
import { sendLead } from "../_lib/leadClient";
import { EVENTS, track } from "../_lib/analytics";
import { CallLinks, Field, PrivacyConsent, btnOrange, inputCls } from "./EstimateForm";
import Reveal from "./Reveal";

// 카드가 놓인 위치 — 전환 이벤트 구분값이자, 관리자 '상담 관리' 메모에 남는 표시
type QuickLocation = "hero" | "top" | "middle";
const LOCATION_NOTE: Record<QuickLocation, string> = {
  hero: "[간편 견적] 상단",
  top: "[간편 견적] 상단",
  middle: "[간편 견적] 중간",
};

type Errors = Partial<Record<"name" | "phone" | "agree", string>>;

export function QuickEstimateCard({
  idPrefix,
  location,
  wide = false,
  className = "",
}: {
  idPrefix: string; // 한 페이지에 여러 번 렌더되므로 input id 충돌 방지
  location: QuickLocation;
  wide?: boolean; // 중간 섹션용 가로로 넓은 카드 — 성함·연락처를 한 줄에 나란히
  className?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState(""); // 봇 차단용 숨김 칸 — 사람은 볼 수 없으니 값이 있으면 봇
  const [errors, setErrors] = useState<Errors>({});
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const validate = (): boolean => {
    const next: Errors = {};
    if (!name.trim()) next.name = "성함을 입력해주세요.";
    if (!phone.trim()) next.phone = "연락 가능한 번호를 입력해주세요.";
    else if (!/^[0-9-+\s]{9,}$/.test(phone.trim())) next.phone = "올바른 연락처 형식이 아닙니다.";
    if (!agree) next.agree = "개인정보 수집 및 이용에 동의해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const reset = () => {
    setDone(true);
    setName("");
    setPhone("");
    setAgree(false);
    setErrors({});
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pending || !validate()) return;
    setServerError(null);
    // 숨김 칸이 채워졌으면 봇 — 저장도 전환 이벤트도 없이 접수된 것처럼만 보여 준다
    if (website) {
      reset();
      return;
    }
    // 유입 키워드(파워링크 n_keyword / utm_term / ?kw=)에 맞는 제품이 있으면 함께 기록 — 4단계 폼의 프리필과 같은 규칙
    const kw = getEntryKeyword() ?? new URLSearchParams(window.location.search).get("kw");
    const matched = matchKeyword(kw).product;
    const products = matched ? [matchProductOption(matched, PRODUCT_TYPE_OPTIONS)] : [];
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      products,
      message: LOCATION_NOTE[location],
      agree,
      attribution: getAttribution(),
      page: window.location.href,
    };
    startTransition(async () => {
      const res = await sendLead(payload);
      if (!res.ok) {
        setServerError(res.error);
        return;
      }
      track(EVENTS.LEAD_SUBMIT, { products: products.join(","), lead_id: res.id, form: "quick", location });
      reset();
    });
  };

  return (
    <div className={`relative rounded-3xl bg-white p-6 text-foreground shadow-[0_20px_60px_-30px_rgba(43,37,33,0.35)] ${wide ? "sm:p-10 md:p-14" : "sm:p-8"} ${className}`}>
      <p className="eyebrow font-semibold text-orange!">FREE ESTIMATE</p>
      {/* 카드 우상단 달력 아이콘 (장식) — 카드 안쪽 여백에 맞춰 위치 */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`absolute top-6 right-6 text-accent ${wide ? "sm:top-10 sm:right-10 md:top-14 md:right-14" : "sm:top-8 sm:right-8"}`}>
        <path d="M8 2v4M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
      </svg>

      {done ? (
        // 접수 완료 패널 — 체크 아이콘 + 성공 문구 + 추가 신청 링크
        <div className="flex flex-col items-center py-10 text-center" role="status">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange/10 text-orange">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="mt-6 text-base leading-relaxed font-medium">{FORM_SUCCESS}</p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-6 text-sm text-muted underline underline-offset-4 transition-colors hover:text-foreground"
          >
            추가 신청
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <h2 className={`serif font-semibold tracking-tight ${wide ? "mt-5 text-2xl leading-snug md:text-4xl md:leading-[1.4]" : "mt-3 text-2xl leading-snug"}`}>
            우리 집 맞춤 커튼,
            <br />
            간편 견적부터 받아보세요.
          </h2>
          <p className={`text-[15px] leading-relaxed text-muted ${wide ? "mt-3 md:mt-5 md:text-base" : "mt-2"}`}>공간과 취향에 맞는 커튼을 제안합니다.</p>

          <div className={`space-y-4 ${wide ? "mt-6 md:mt-8 md:space-y-5" : "mt-6"}`}>
            {/* 성함·연락처 — 넓은 카드는 한 줄에 나란히, 좁은 카드는 세로로 */}
            <div className={wide ? "grid gap-4 sm:grid-cols-2 sm:gap-5" : "space-y-4"}>
            <Field label="성함" required error={errors.name} htmlFor={`${idPrefix}-name`}>
              <input
                id={`${idPrefix}-name`}
                type="text"
                autoComplete="name"
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="성함을 입력해 주세요"
                className={inputCls}
                aria-invalid={!!errors.name}
              />
            </Field>
            <Field label="연락처" required error={errors.phone} htmlFor={`${idPrefix}-phone`}>
              <input
                id={`${idPrefix}-phone`}
                type="tel"
                autoComplete="tel"
                maxLength={20}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className={inputCls}
                aria-invalid={!!errors.phone}
              />
            </Field>
            </div>

            {/* 봇 차단용 숨김 칸 — 화면·키보드·스크린리더 어디에도 나오지 않는다 */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={`${idPrefix}-website`}>이 칸은 비워 두세요</label>
              <input
                id={`${idPrefix}-website`}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <PrivacyConsent
              id={`${idPrefix}-privacy`}
              label="개인정보 수집·이용 동의"
              plain
              checked={agree}
              onChange={setAgree}
              error={errors.agree}
            />

            {/* 넓은 카드: 문구 좌측 + 원형 화살표 우측 / 좁은 카드: 가운데 정렬 */}
            <button type="submit" disabled={pending} className={`${btnOrange} w-full ${wide ? "justify-between! px-6 md:h-16 md:px-8 md:text-lg" : ""}`}>
              {pending ? "접수 중..." : "무료 견적 신청"}
              {!pending && (
                <span className={wide ? "flex h-7 w-7 items-center justify-center rounded-full bg-white text-orange" : "contents"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              )}
            </button>
            {/* 저장 실패 시에만 오류 문구 + 전화번호 (오류 문구가 "아래 번호로 전화" 를 안내한다) */}
            {serverError && (
              <>
                <p role="alert" className="text-center text-sm text-red-500">
                  {serverError}
                </p>
                <CallLinks location={`quick-${location}`} />
              </>
            )}
            <p className="text-center text-sm text-muted">방문 일정은 신청 후 상담으로 확정합니다.</p>
            <p className="text-center text-xs text-muted">매장 방문 없이, 우리 집에서 편안하게.</p>
          </div>
        </form>
      )}
    </div>
  );
}

// 모바일·태블릿 전용 — 히어로 바로 아래 간편 견적 (PC 는 히어로 우측 패널에 같은 카드가 있어 숨긴다)
export function QuickEstimateTop() {
  return (
    <section aria-label="간편 견적 신청" className="bg-surface px-5 pt-8 pb-2 lg:hidden">
      <div className="mx-auto max-w-xl">
        <QuickEstimateCard idPrefix="top" location="top" />
      </div>
    </section>
  );
}

// 페이지 중간 간편 견적 섹션 — 제품 소개를 본 직후, 시공 사례 앞. 가로로 넓은 카드 하나
export default function QuickEstimateSection() {
  return (
    <section id="quick-estimate" className="scroll-mt-20 bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <QuickEstimateCard idPrefix="mid" location="middle" wide />
        </Reveal>
      </div>
    </section>
  );
}
