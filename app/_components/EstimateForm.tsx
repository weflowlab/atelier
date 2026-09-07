"use client";
// 무료 방문 실측 신청 폼 섹션 (#estimate) — 4단계 위저드 (참고 시안 구조).
// ① 안내 → ② 설치 장소(중복 선택) → ③ 설치 희망 날짜 → ④ 연락받을 정보(성함·연락처·주소·추가 문의·동의).
// 유입 키워드/라이트박스로 제품 프리필(숨은 필드) → 검증 → submitLead 서버 액션 → 성공 패널 + 전환 이벤트(track) 전송.
import { useEffect, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { FORM_SUCCESS, PLACE_OPTIONS, PRODUCT_TYPE_OPTIONS } from "../_lib/data";
import { submitLead } from "../_actions/submitLead";
import { getAttribution, getEntryKeyword } from "../_lib/attribution";
import { matchKeyword } from "../_lib/keywords";
import { PRESELECT_EVENT, matchProductOption } from "../_lib/formEvents";
import { EVENTS, track } from "../_lib/analytics";
import Reveal from "./Reveal";

type FormState = {
  name: string;
  phone: string;
  address: string;     // 설치 희망 주소 (선택)
  date: string;        // 희망 날짜 (선택, yyyy-mm-dd)
  places: string[];    // 설치 장소 (중복 선택)
  products: string[];  // 설치 제품 — UI 없이 키워드/라이트박스 프리필로만 채워짐
  message: string;
  agree: boolean;
};

const INITIAL: FormState = {
  name: "",
  phone: "",
  address: "",
  date: "",
  places: [],
  products: [],
  message: "",
  agree: false,
};

type Errors = Partial<Record<"name" | "phone" | "agree", string>>;

const TOTAL_STEPS = 4;

// 소프트 라운드 인풋 공통 클래스
const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3 py-3 text-[15px] outline-none sm:px-4 sm:py-3.5 sm:text-base transition-colors placeholder:text-muted/70 focus:border-orange aria-[invalid=true]:border-red-400";
// 주황 메인 버튼 / 이전(고스트) 버튼
const btnOrange =
  "flex h-14 items-center justify-center gap-2 rounded-2xl bg-orange text-base font-semibold text-white transition-colors hover:bg-[#cf5630] disabled:cursor-not-allowed disabled:bg-line disabled:text-muted";
const btnGhost =
  "flex h-14 items-center justify-center rounded-2xl border border-line bg-surface px-5 text-base font-medium text-muted transition-colors hover:text-foreground";

// 단계별 상단 아이콘 (주황 원 안 라인 아이콘)
function StepIcon({ children }: { children: ReactNode }) {
  return (
    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange/10 text-orange">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </span>
  );
}

// 위저드 카드 본체 — 하단 폼 섹션과 PC 히어로 우측 패널이 같은 컴포넌트를 재사용한다.
// idPrefix: 한 페이지에 두 번 렌더될 때 input id 충돌 방지 / compact: 히어로 패널용 좁은 패딩
export function EstimateWizard({
  idPrefix = "est",
  compact = false,
  className = "",
}: {
  idPrefix?: string;
  compact?: boolean;
  className?: string;
}) {
  const [step, setStep] = useState(0); // 0 안내 · 1 장소 · 2 날짜 · 3 연락처
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [privacyOpen, setPrivacyOpen] = useState(false); // 개인정보 안내문 펼침 여부
  const [pending, startTransition] = useTransition();     // 서버 액션 전송 중
  const [serverError, setServerError] = useState<string | null>(null); // 서버 응답 오류
  const [done, setDone] = useState(false);                // 접수 완료 상태
  const [today, setToday] = useState("");                 // 희망날짜 최소값(오늘) — 클라이언트 시간대 기준으로 마운트 후 계산
  useEffect(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }, []);

  // 유입 키워드(파워링크 n_keyword / utm_term / ?kw=)로 설치 제품 프리필 (마운트 1회)
  useEffect(() => {
    const kw = getEntryKeyword() ?? new URLSearchParams(window.location.search).get("kw");
    const m = matchKeyword(kw);
    if (!m.product) return;
    const type = matchProductOption(m.product, PRODUCT_TYPE_OPTIONS);
    // URL/sessionStorage(외부 상태) → 클라이언트 전용 프리필
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((f) => ({ ...f, products: [type] }));
  }, []);

  // 라이트박스 "이 제품으로 신청" → 해당 상품 기록 + 위저드 시작 (커스텀 이벤트 수신)
  useEffect(() => {
    const onPreselect = (e: Event) => {
      const product = (e as CustomEvent<{ product: string }>).detail?.product;
      if (!product) return;
      const type = matchProductOption(product, PRODUCT_TYPE_OPTIONS); // 제품명 → 폼 옵션
      setDone(false); // 접수 완료 화면이었다면 폼으로 복귀
      setStep(1);     // 바로 설치 장소 선택부터
      setForm((f) => ({ ...f, products: [type] }));
    };
    window.addEventListener(PRESELECT_EVENT, onPreselect);
    return () => window.removeEventListener(PRESELECT_EVENT, onPreselect);
  }, []);

  // 단계 이동 — 카드 상단이 화면 위로 벗어나 있으면(긴 4단계에서 '이전' 등) 카드 맨 위가 보이게 스크롤
  const cardRef = useRef<HTMLDivElement>(null);
  const goStep = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return;
      el.scrollTop = 0; // 히어로 패널처럼 카드 자체가 스크롤 컨테이너인 경우
      if (el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // 필드 단건 업데이트 헬퍼
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // 설치 장소 토글 (중복 선택)
  const togglePlace = (p: string) =>
    set("places", form.places.includes(p) ? form.places.filter((x) => x !== p) : [...form.places, p]);

  // 필수값 검증 — 오류 메시지를 필드 아래 인라인 표시
  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "성함을 입력해주세요.";
    if (!form.phone.trim()) next.phone = "연락 가능한 번호를 입력해주세요.";
    else if (!/^[0-9-+\s]{9,}$/.test(form.phone.trim())) next.phone = "올바른 연락처 형식이 아닙니다.";
    if (!form.agree) next.agree = "개인정보 수집 및 이용에 동의해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // 제출: 검증 → 서버 액션(유입 정보 포함) → 성공 시 패널 전환 + 전환 이벤트, 실패 시 버튼 근처 오류 표시
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pending || !validate()) return;
    setServerError(null);
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || undefined,
      date: form.date || undefined,
      places: form.places,
      products: form.products,
      message: form.message.trim() || undefined,
      agree: form.agree,
      attribution: getAttribution(),
      page: window.location.href,
    };
    startTransition(async () => {
      try {
        const res = await submitLead(payload);
        if (!res.ok) {
          setServerError(res.error);
          return;
        }
        track(EVENTS.LEAD_SUBMIT, { products: payload.products.join(","), lead_id: res.id });
        setDone(true);
        setForm(INITIAL);
        setErrors({});
        setPrivacyOpen(false);
        setStep(0);
      } catch {
        setServerError("전송 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 전화로 문의해주세요.");
      }
    });
  };

  return (
          <div ref={cardRef} className={`scroll-mt-24 rounded-3xl bg-white text-foreground shadow-[0_20px_60px_-30px_rgba(43,37,33,0.35)] ${compact ? "p-5 lg:p-6" : "p-6 md:p-10"} ${className}`}>
            {/* 진행 표시 — 좌측 라벨 칩 + 우측 n/4 + 진행바 */}
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-orange/10 px-3.5 py-1.5 text-sm font-semibold text-orange">무료 방문 실측</span>
              <span className="text-sm text-muted">{Math.min(step + 1, TOTAL_STEPS)}/{TOTAL_STEPS}</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-line/70">
              <div
                className="h-full rounded-full bg-orange transition-all duration-500"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>

            {done ? (
              // 접수 완료 패널 — 체크 아이콘 + 성공 문구 + 추가 신청 링크
              <div className="mt-10 flex flex-col items-center py-6 text-center" role="status">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange/10 text-orange">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                {/* ① 안내 */}
                {step === 0 && (
                  <div key="s0" className="mt-10 animate-[estStep_0.35s_ease] text-center">
                    <StepIcon>
                      <path d="M3 10.5 12 3l9 7.5" />
                      <path d="M5 9.5V21h14V9.5" />
                    </StepIcon>
                    <p className="mt-6 text-sm text-muted">커튼 &amp; 블라인드</p>
                    <h2 className="serif mt-2 text-3xl font-semibold tracking-tight">
                      커튼&amp;블라인드
                      <br />
                      <span className="text-orange">무료 방문 실측</span>
                    </h2>
                    <ul className="mx-auto mt-8 w-fit space-y-3.5 text-left text-[15px] sm:text-base">
                      {["방문 실측은 무료예요", "자체 공장에서 제작해요", "합리적인 가격으로 제작이 가능해요"].map((t) => (
                        <li key={t} className="flex items-center gap-2.5">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-orange" aria-hidden>
                            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => goStep(1)} className={`${btnOrange} mt-10 w-full`}>
                      무료 방문 실측 시작하기
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* ② 설치 장소 (중복 선택) */}
                {step === 1 && (
                  <div key="s1" className="mt-10 animate-[estStep_0.35s_ease] text-center">
                    <StepIcon>
                      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </StepIcon>
                    <p className="mt-6 text-sm text-muted">설치 정보를 알려주세요</p>
                    <h2 className="serif mt-2 text-3xl font-semibold tracking-tight">설치 장소</h2>
                    <p className="mt-2 text-sm text-orange">중복 선택 가능해요</p>
                    <div className="mt-8 grid grid-cols-2 gap-3">
                      {PLACE_OPTIONS.map((p) => {
                        const on = form.places.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => togglePlace(p)}
                            aria-pressed={on}
                            className={`rounded-2xl border px-3 py-5 text-[15px] transition-colors sm:text-base ${
                              on
                                ? "border-orange bg-orange/10 font-semibold text-orange"
                                : "border-line bg-surface text-foreground hover:border-muted/50"
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-10 flex gap-3">
                      <button type="button" onClick={() => goStep(0)} className={btnGhost}>
                        이전
                      </button>
                      <button type="button" onClick={() => goStep(2)} disabled={form.places.length === 0} className={`${btnOrange} flex-1`}>
                        다음
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* ③ 설치 희망 날짜 */}
                {step === 2 && (
                  <div key="s2" className="mt-10 animate-[estStep_0.35s_ease] text-center">
                    <StepIcon>
                      <path d="M8 2v4M16 2v4" />
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path d="M3 10h18" />
                    </StepIcon>
                    <p className="mt-6 text-sm text-muted">편한 날짜를 선택해 주세요</p>
                    <h2 className="serif mt-2 text-3xl font-semibold tracking-tight">설치 희망 날짜</h2>
                    <div className="mt-8 rounded-2xl border border-line bg-surface px-4 py-4 text-left">
                      <label htmlFor={`${idPrefix}-date`} className="block text-sm text-muted">희망 날짜</label>
                      {/* iOS Safari: 날짜 입력이 내용 폭으로 줄어들고 min 을 무시하는 경우가 있어 폭 강제 + onChange 에서 과거 날짜 차단 */}
                      <input
                        id={`${idPrefix}-date`}
                        type="date"
                        value={form.date}
                        min={today}
                        onChange={(e) => {
                          const v = e.target.value;
                          set("date", v && today && v < today ? today : v); // 오늘 이전이면 오늘로 보정
                        }}
                        className="mt-1.5 block min-h-[2.5rem] w-full min-w-full appearance-none bg-transparent text-center text-lg outline-none [color-scheme:light] [&::-webkit-date-and-time-value]:min-h-[1.5rem] [&::-webkit-date-and-time-value]:text-center"
                      />
                    </div>
                    <p className="mt-4 text-sm text-muted">정확한 일정은 담당자와 상담 후 확정됩니다.</p>
                    <div className="mt-10 flex gap-3">
                      <button type="button" onClick={() => goStep(1)} className={btnGhost}>
                        이전
                      </button>
                      <button type="button" onClick={() => goStep(3)} className={`${btnOrange} flex-1`}>
                        다음
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* ④ 연락받을 정보 + 추가 문의 + 동의 */}
                {step === 3 && (
                  <div key="s3" className="mt-10 animate-[estStep_0.35s_ease]">
                    <div className="text-center">
                      <StepIcon>
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </StepIcon>
                      <p className="mt-6 text-sm text-muted">마지막 단계예요</p>
                      <h2 className="serif mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                        연락받을 정보를<br className={compact ? "" : "md:hidden"} /> 입력해 주세요
                      </h2>
                    </div>

                    <div className="mt-8 space-y-5">
                      <Field label="성함" required error={errors.name} htmlFor={`${idPrefix}-name`}>
                        <input
                          id={`${idPrefix}-name`}
                          type="text"
                          autoComplete="name"
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
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
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          placeholder="010-0000-0000"
                          className={inputCls}
                          aria-invalid={!!errors.phone}
                        />
                      </Field>
                      <Field label="설치 희망 주소" htmlFor={`${idPrefix}-address`}>
                        <input
                          id={`${idPrefix}-address`}
                          type="text"
                          autoComplete="street-address"
                          value={form.address}
                          onChange={(e) => set("address", e.target.value)}
                          placeholder="주소를 입력해 주세요"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="추가 문의사항" htmlFor={`${idPrefix}-message`}>
                        <textarea
                          id={`${idPrefix}-message`}
                          rows={3}
                          value={form.message}
                          onChange={(e) => set("message", e.target.value)}
                          placeholder="추가 문의사항이 있다면 작성해 주세요."
                          className={`${inputCls} resize-none`}
                        />
                      </Field>

                      {/* 개인정보 수집 및 이용 동의 — 체크 1줄 + "내용 보기" 토글 안내문 */}
                      <div className="rounded-xl border border-line bg-surface px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="flex cursor-pointer items-center gap-2 text-[15px] sm:text-base">
                            <input
                              type="checkbox"
                              checked={form.agree}
                              onChange={(e) => set("agree", e.target.checked)}
                              className="h-4 w-4 accent-orange"
                              aria-invalid={!!errors.agree}
                            />
                            <span>개인정보 수집 및 이용에 동의합니다. <span className="whitespace-nowrap text-red-500">(필수)</span></span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setPrivacyOpen((v) => !v)}
                            aria-expanded={privacyOpen}
                            aria-controls={`${idPrefix}-privacy`}
                            className="self-end text-sm text-muted underline underline-offset-4 transition-colors hover:text-foreground"
                          >
                            {privacyOpen ? "닫기" : "내용 보기"}
                          </button>
                        </div>
                        {/* grid-rows 트릭으로 높이 애니메이션 (0fr ↔ 1fr) */}
                        <div
                          id={`${idPrefix}-privacy`}
                          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                            privacyOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            {/* 플레이스홀더 약관 문구 — 실제 개인정보처리방침으로 교체 필요 */}
                            <div className="mt-3 max-h-32 space-y-2 overflow-auto border-t border-line pt-3 text-sm leading-relaxed text-muted">
                              <p>
                                1. 수집 항목 및 목적: 성함, 연락처, 설치 지역, 원하는 상품, 문의 내용을 무료 방문 실측 상담 및 확인 전화
                                안내를 위해 수집하며, 명시된 목적 외의 용도로 이용하지 않습니다.
                              </p>
                              <p>
                                2. 보유 및 이용 기간: 상담 종료 후 1년까지 보관 후 지체 없이 파기합니다. 동의를 거부하실 수
                                있으나, 거부 시 신청이 제한될 수 있습니다.
                              </p>
                            </div>
                          </div>
                        </div>
                        {errors.agree && <p className="mt-2 text-sm text-red-500">{errors.agree}</p>}
                      </div>

                      <div className="flex gap-3">
                        <button type="button" onClick={() => goStep(2)} className={btnGhost}>
                          이전
                        </button>
                        <button type="submit" disabled={pending} className={`${btnOrange} flex-1`}>
                          {pending ? "접수 중..." : "완료하기"}
                          {!pending && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {serverError && (
                        <p role="alert" className="text-center text-sm text-red-500">
                          {serverError}
                        </p>
                      )}
                      <p className="text-center text-sm text-muted">입력 정보는 방문 상담 안내에만 사용됩니다.</p>

                      {/* 대체 연락 수단 — 전화 (휴대폰 · 대표번호) */}
                      <p className="text-center text-sm text-muted">
                        또는 전화{" "}
                        <a
                          href="tel:01041262209"
                          onClick={() => track(EVENTS.CLICK_CALL, { location: "form" })}
                          className="underline underline-offset-4 transition-colors hover:text-foreground"
                        >
                          010-4126-2209
                        </a>{" "}
                        ·{" "}
                        <a
                          href="tel:18332523"
                          onClick={() => track(EVENTS.CLICK_CALL, { location: "form" })}
                          className="underline underline-offset-4 transition-colors hover:text-foreground"
                        >
                          1833-2523
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </form>
            )}

            {/* 단계 전환 페이드업 */}
            <style>{`
              @keyframes estStep { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
              @media (prefers-reduced-motion: reduce) {
                [class*="estStep"] { animation: none !important; }
              }
            `}</style>
          </div>
  );
}

// 하단 신청 폼 섹션 (#estimate) — 위저드 카드를 가운데 배치
export default function EstimateForm() {
  return (
    <section id="estimate" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-xl px-5">
        <Reveal>
          <EstimateWizard />
        </Reveal>
      </div>
    </section>
  );
}

// 라벨 + 입력 영역 (세로 스택) + 인라인 오류
function Field({
  label,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  const labelCls = "mb-1.5 block text-[15px] font-medium sm:mb-2 sm:text-base";
  const inner = (
    <>
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </>
  );
  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelCls}>{inner}</label>
      ) : (
        <span className={labelCls}>{inner}</span>
      )}
      {children}
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
