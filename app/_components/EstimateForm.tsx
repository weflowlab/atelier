"use client";
// 무료 방문 실측 신청 폼 섹션 (#estimate) — DB 수집: 성함/연락처/설치지역(필수) + 원하는 상품/문의내용(선택).
// 유입 키워드로 지역·상품 프리필 → 검증 → submitLead 서버 액션 → 성공 패널 + 전환 이벤트(track) 전송.
import { useEffect, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { FORM_SUCCESS, PRODUCT_OPTIONS, REGION_OPTIONS, SITE } from "../_lib/data";
import { submitLead } from "../_actions/submitLead";
import { getAttribution, getEntryKeyword } from "../_lib/attribution";
import { matchKeyword } from "../_lib/keywords";
import { PRESELECT_EVENT, matchProductOption } from "../_lib/formEvents";
import { EVENTS, track } from "../_lib/analytics";
import Reveal from "./Reveal";

const OTHER_REGION = "기타 지역"; // 선택 시 직접 입력 필드 노출

type FormState = {
  name: string;
  phone: string;
  region: string;      // REGION_OPTIONS 중 하나
  regionEtc: string;   // "기타 지역" 선택 시 직접 입력값
  products: string[];
  message: string;
  agree: boolean;
};

const INITIAL: FormState = {
  name: "",
  phone: "",
  region: "",
  regionEtc: "",
  products: [],
  message: "",
  agree: false,
};

type Errors = Partial<Record<"name" | "phone" | "region" | "agree", string>>;

// 소프트 라운드 인풋 공통 클래스
const inputCls =
  "w-full rounded-lg border border-line bg-surface px-4 py-3.5 text-base outline-none transition-colors placeholder:text-muted/70 focus:border-accent aria-[invalid=true]:border-red-400";
// 선택 pill 공통 클래스 (선택 여부에 따라 반전)
const pillCls = (on: boolean) =>
  `cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors select-none ${
    on ? "border-accent bg-accent text-white" : "border-line bg-surface text-muted hover:border-accent hover:text-foreground"
  }`;

export default function EstimateForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [privacyOpen, setPrivacyOpen] = useState(false); // 개인정보 안내문 펼침 여부
  const [pending, startTransition] = useTransition();     // 서버 액션 전송 중
  const [serverError, setServerError] = useState<string | null>(null); // 서버 응답 오류
  const [done, setDone] = useState(false);                // 접수 완료 상태

  // 유입 키워드(파워링크 n_keyword / utm_term / ?kw=)로 지역·상품 프리필 (마운트 1회)
  useEffect(() => {
    const kw = getEntryKeyword() ?? new URLSearchParams(window.location.search).get("kw");
    const m = matchKeyword(kw);
    if (!m.region && !m.product) return;
    // URL/sessionStorage(외부 상태) → 클라이언트 전용 프리필
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((f) => {
      const region = m.region && REGION_OPTIONS.includes(m.region) ? m.region : f.region;
      const product = m.product ? PRODUCT_OPTIONS.find((p) => p.includes(m.product!)) : undefined;
      const products = product && !f.products.includes(product) ? [...f.products, product] : f.products;
      return { ...f, region, products };
    });
  }, []);

  // 라이트박스 "이 제품으로 신청" → 해당 상품 자동 체크 (커스텀 이벤트 수신)
  useEffect(() => {
    const onPreselect = (e: Event) => {
      const product = (e as CustomEvent<{ product: string }>).detail?.product;
      if (!product) return;
      const opt = matchProductOption(product, PRODUCT_OPTIONS);
      if (!opt) return;
      setDone(false); // 접수 완료 화면이었다면 폼으로 복귀
      setForm((f) => (f.products.includes(opt) ? f : { ...f, products: [...f.products, opt] }));
    };
    window.addEventListener(PRESELECT_EVENT, onPreselect);
    return () => window.removeEventListener(PRESELECT_EVENT, onPreselect);
  }, []);

  // 필드 단건 업데이트 헬퍼
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // 원하는 상품 체크박스 토글 (다중 선택)
  const toggleProduct = (p: string) =>
    setForm((f) => ({
      ...f,
      products: f.products.includes(p) ? f.products.filter((x) => x !== p) : [...f.products, p],
    }));

  // 최종 지역값 — "기타 지역"이면 직접 입력값 사용
  const regionFinal = form.region === OTHER_REGION ? form.regionEtc.trim() : form.region;

  // 필수값 검증 — 오류 메시지를 필드 아래 인라인 표시
  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "성함을 입력해주세요.";
    if (!form.phone.trim()) next.phone = "연락 가능한 번호를 입력해주세요.";
    else if (!/^[0-9-+\s]{9,}$/.test(form.phone.trim())) next.phone = "올바른 연락처 형식이 아닙니다.";
    if (!form.region) next.region = "설치 지역을 선택해주세요.";
    else if (form.region === OTHER_REGION && !form.regionEtc.trim()) next.region = "지역을 입력해주세요.";
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
      region: regionFinal,
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
        track(EVENTS.LEAD_SUBMIT, { region: payload.region, products: payload.products.join(","), lead_id: res.id });
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
              <p className="mt-3 text-base text-muted">이름 · 연락처 · 지역만 남겨주시면 확인 후 빠르게 연락드립니다.</p>
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
                {/* 성함 */}
                <Field label="성함" required error={errors.name} htmlFor="est-name">
                  <input
                    id="est-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="성함을 입력하세요"
                    className={inputCls}
                    aria-invalid={!!errors.name}
                  />
                </Field>

                {/* 연락처 */}
                <Field label="연락처" required error={errors.phone} htmlFor="est-phone">
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

                {/* 설치 지역 — 라디오 pill (단일 선택) + "기타 지역" 직접 입력 */}
                <Field label="설치 지역" required error={errors.region}>
                  <div role="radiogroup" aria-label="설치 지역" className="flex flex-wrap gap-2 pt-1">
                    {REGION_OPTIONS.map((r) => {
                      const on = form.region === r;
                      return (
                        <label key={r} className={pillCls(on)}>
                          <input
                            type="radio"
                            name="est-region"
                            value={r}
                            checked={on}
                            onChange={() => set("region", r)}
                            className="sr-only"
                          />
                          {r}
                        </label>
                      );
                    })}
                  </div>
                  {form.region === OTHER_REGION && (
                    <input
                      type="text"
                      value={form.regionEtc}
                      onChange={(e) => set("regionEtc", e.target.value)}
                      placeholder="지역을 입력해주세요 (예: 하남 미사)"
                      aria-label="기타 지역 직접 입력"
                      className={`${inputCls} mt-2.5`}
                      aria-invalid={!!errors.region}
                      autoFocus
                    />
                  )}
                </Field>

                {/* 원하는 상품 — 다중 선택 체크박스 pill */}
                <Field label="원하는 상품 (선택)">
                  <div className="flex flex-wrap gap-2 pt-1">
                    {PRODUCT_OPTIONS.map((p) => {
                      const on = form.products.includes(p);
                      return (
                        <label key={p} className={pillCls(on)}>
                          <input type="checkbox" checked={on} onChange={() => toggleProduct(p)} className="sr-only" />
                          {p}
                        </label>
                      );
                    })}
                  </div>
                </Field>

                {/* 문의 내용 */}
                <Field label="문의 내용 (선택)" htmlFor="est-message">
                  <textarea
                    id="est-message"
                    rows={3}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="창 개수, 사이즈, 원하시는 스타일 등을 적어주세요"
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
