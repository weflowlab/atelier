"use client";
// 무료 방문 실측 신청 폼 섹션 (#estimate) — 입력 최소화(참고 시안): 이름·전화번호(필수) + 주소·희망날짜·설치장소·설치제품·추가 문의(선택) + 동의.
// 유입 키워드/라이트박스로 제품 프리필 → 검증 → submitLead 서버 액션 → 성공 패널 + 전환 이벤트(track) 전송.
import { useEffect, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { FORM_SUCCESS, PLACE_OPTIONS, PRODUCT_TYPE_OPTIONS, SITE } from "../_lib/data";
import { submitLead } from "../_actions/submitLead";
import { getAttribution, getEntryKeyword } from "../_lib/attribution";
import { matchKeyword } from "../_lib/keywords";
import { PRESELECT_EVENT, matchProductOption } from "../_lib/formEvents";
import { EVENTS, track } from "../_lib/analytics";
import Reveal from "./Reveal";

type FormState = {
  name: string;
  phone: string;
  address: string;     // 주소 (선택)
  date: string;        // 희망 날짜 (선택, yyyy-mm-dd)
  places: string[];    // 설치 장소 (드롭다운 단일 → 배열 1개)
  products: string[];  // 설치 제품 (드롭다운: 커튼 / 블라인드 / 상담 후 결정)
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

// 드롭다운(select) — 기본 화살표 제거(appearance-none) + 오른쪽 커스텀 아래 화살표(인라인 배경 SVG)
const selectCls = "appearance-none pr-10";
const selectStyle: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%237d7168' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.9rem center",
};
// 소프트 라운드 인풋 공통 클래스
const inputCls =
  "w-full rounded-lg border border-line bg-surface px-4 py-3.5 text-base outline-none transition-colors placeholder:text-muted/70 focus:border-accent aria-[invalid=true]:border-red-400";
export default function EstimateForm() {
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

  // 라이트박스 "이 제품으로 신청" → 해당 상품 자동 체크 (커스텀 이벤트 수신)
  useEffect(() => {
    const onPreselect = (e: Event) => {
      const product = (e as CustomEvent<{ product: string }>).detail?.product;
      if (!product) return;
      const type = matchProductOption(product, PRODUCT_TYPE_OPTIONS); // 제품명 → 폼 옵션
      setDone(false); // 접수 완료 화면이었다면 폼으로 복귀
      setForm((f) => ({ ...f, products: [type] }));
    };
    window.addEventListener(PRESELECT_EVENT, onPreselect);
    return () => window.removeEventListener(PRESELECT_EVENT, onPreselect);
  }, []);

  // 필드 단건 업데이트 헬퍼
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));


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
      } catch {
        setServerError("전송 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 전화로 문의해주세요.");
      }
    });
  };

  return (
    <section id="estimate" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-5">
        <Reveal>
          <div className="rounded-2xl border border-line bg-background p-6 shadow-[0_20px_60px_-30px_rgba(43,37,33,0.35)] md:p-10">
            {/* 카드 헤더 */}
            <div className="text-center">
              <p className="eyebrow">CALL TO ACTION</p>
              <h2 className="serif mt-3 text-3xl font-medium tracking-tight md:text-4xl">무료 방문 실측 신청</h2>
              <p className="mt-3 text-base text-muted">이름 · 전화번호만 남겨주시면<br className="md:hidden" /> 확인 후 빠르게 연락드립니다.</p>
            </div>

            {done ? (
              // 접수 완료 패널 — 체크 아이콘 + 성공 문구 + 추가 신청 링크
              <div className="mt-10 flex flex-col items-center py-6 text-center" role="status">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
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
              <form onSubmit={onSubmit} noValidate className="mt-10 space-y-6">
                {/* 이름 · 전화번호 (필수) — 시안처럼 한 줄 2칸 */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="이름" required error={errors.name} htmlFor="est-name">
                    <input
                      id="est-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="이름"
                      className={inputCls}
                      aria-invalid={!!errors.name}
                    />
                  </Field>
                  <Field label="전화번호" required error={errors.phone} htmlFor="est-phone">
                    <input
                      id="est-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="010-0000-0000"
                      className={inputCls}
                      aria-invalid={!!errors.phone}
                    />
                  </Field>
                </div>

                {/* 주소 · 설치장소 — 한 줄 2칸 */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="주소" htmlFor="est-address">
                    <input
                      id="est-address"
                      type="text"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      placeholder="시/구/동까지 입력해주셔도 됩니다"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="설치장소" htmlFor="est-place">
                    <select
                      id="est-place"
                      value={form.places[0] ?? ""}
                      onChange={(e) => set("places", e.target.value ? [e.target.value] : [])}
                      className={`${inputCls} ${selectCls}`}
                      style={selectStyle}
                    >
                      <option value="">선택</option>
                      {PLACE_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* 희망날짜 · 설치제품 — 한 줄 2칸 */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="희망날짜" htmlFor="est-date">
                    {/* iOS Safari: 날짜 입력이 내용 폭으로 줄어들고 min 을 무시하는 경우가 있어 폭 강제 + onChange 에서 과거 날짜 차단 */}
                    <input
                      id="est-date"
                      type="date"
                      value={form.date}
                      min={today}
                      onChange={(e) => {
                        const v = e.target.value;
                        set("date", v && today && v < today ? today : v); // 오늘 이전이면 오늘로 보정
                      }}
                      className={`${inputCls} block min-h-[3.25rem] w-full min-w-full appearance-none [color-scheme:light] [&::-webkit-date-and-time-value]:min-h-[1.5rem] [&::-webkit-date-and-time-value]:text-left`}
                    />
                    <p className="mt-1.5 text-xs text-muted">오늘 이후 날짜만 선택할 수 있어요.</p>
                  </Field>
                  <Field label="설치제품" htmlFor="est-product">
                    <select
                      id="est-product"
                      value={form.products[0] ?? ""}
                      onChange={(e) => set("products", e.target.value ? [e.target.value] : [])}
                      className={`${inputCls} ${selectCls}`}
                      style={selectStyle}
                    >
                      <option value="">선택</option>
                      {PRODUCT_TYPE_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* 추가 문의 사항 */}
                <Field label="추가 문의 사항" htmlFor="est-message">
                  <textarea
                    id="est-message"
                    rows={3}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="추가 문의사항이 있다면 작성해 주세요."
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                {/* 개인정보 수집 및 이용 동의 — 체크 1줄 + "내용 보기" 토글 안내문 */}
                <div className="rounded-lg border border-line bg-surface px-4 py-3">
                  {/* 라벨(위) + "내용 보기" 버튼(우하단) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="flex cursor-pointer items-center gap-2 text-base">
                      <input
                        type="checkbox"
                        checked={form.agree}
                        onChange={(e) => set("agree", e.target.checked)}
                        className="h-4 w-4 accent-accent"
                        aria-invalid={!!errors.agree}
                      />
                      <span>개인정보 수집 및 이용에 동의합니다. <span className="whitespace-nowrap text-red-500">(필수)</span></span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPrivacyOpen((v) => !v)}
                      aria-expanded={privacyOpen}
                      aria-controls="privacy-text"
                      className="self-end text-sm text-muted underline underline-offset-4 transition-colors hover:text-foreground"
                    >
                      {privacyOpen ? "닫기" : "내용 보기"}
                    </button>
                  </div>
                  {/* grid-rows 트릭으로 높이 애니메이션 (0fr ↔ 1fr) */}
                  <div
                    id="privacy-text"
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

                {/* 제출 버튼 (전송 중 비활성) + 서버 오류 인라인 */}
                <div>
                  <button
                    type="submit"
                    disabled={pending}
                    className="flex h-14 w-full items-center justify-center rounded-full bg-accent text-base font-semibold text-white transition-colors hover:bg-brown disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pending ? "접수 중..." : "무료 방문 실측 신청하기"}
                  </button>
                  {serverError && (
                    <p role="alert" className="mt-2 text-center text-sm text-red-500">
                      {serverError}
                    </p>
                  )}
                </div>

                {/* 대체 연락 수단 — 전화/카카오 클릭 전환 추적 */}
                <p className="text-center text-sm text-muted md:text-base">
                  또는 전화{" "}
                  <a
                    href={SITE.telHref}
                    onClick={() => track(EVENTS.CLICK_CALL, { location: "form" })}
                    className="underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    {SITE.tels[0]}
                  </a>{" "}
                  ·{" "}
                  <a
                    href={SITE.kakaoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track(EVENTS.CLICK_KAKAO, { location: "form" })}
                    className="underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    카카오톡 문의
                  </a>
                </p>
              </form>
            )}
          </div>
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
  // htmlFor 가 없으면(라디오/체크박스 그룹) label 대신 span 사용
  const labelCls = "mb-2 block text-base font-medium";
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
