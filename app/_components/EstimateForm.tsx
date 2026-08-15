"use client";
// 무료 방문 견적 신청 폼 섹션 (#estimate).
// useState 로만 상태 관리 — 검증 → 확인 모달 → (모의) 전송 → 성공 안내 흐름. 외부 라이브러리 없음.
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { PLACE_OPTIONS, PRODUCT_OPTIONS, SITE } from "../_lib/data";
import Reveal from "./Reveal";

type FormState = {
  name: string;
  phone: string;
  address: string;
  place: string;
  date: string;
  products: string[];
  message: string;
  agree: boolean;
};

const INITIAL: FormState = {
  name: "",
  phone: "",
  address: "",
  place: "",
  date: "",
  products: [],
  message: "",
  agree: false,
};

type Errors = Partial<Record<"name" | "phone" | "agree", string>>;

// 밑줄형 인풋 공통 클래스
const inputCls =
  "w-full border-b border-neutral-300 bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";
// 선택 pill 공통 클래스 (선택 여부에 따라 반전)
const pillCls = (on: boolean) =>
  `cursor-pointer rounded-full border px-3.5 py-1.5 text-xs transition-colors select-none ${
    on
      ? "border-neutral-900 bg-neutral-900 text-white"
      : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500"
  }`;

export default function EstimateForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [privacyOpen, setPrivacyOpen] = useState(false); // 개인정보 안내 박스 펼침 여부
  const [confirmOpen, setConfirmOpen] = useState(false); // 접수 확인 모달
  const [loading, setLoading] = useState(false); // 전송 중
  const [done, setDone] = useState(false); // 접수 완료 상태
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // 필드 단건 업데이트 헬퍼
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // 희망제품 체크박스 토글 (다중 선택)
  const toggleProduct = (p: string) =>
    setForm((f) => ({
      ...f,
      products: f.products.includes(p) ? f.products.filter((x) => x !== p) : [...f.products, p],
    }));

  // 필수값 검증 — 오류 메시지를 필드 아래 인라인 표시
  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "이름을 입력해주세요.";
    if (!form.phone.trim()) next.phone = "연락 가능한 번호를 입력해주세요.";
    else if (!/^[0-9-+\s]{9,}$/.test(form.phone.trim())) next.phone = "올바른 연락처 형식이 아닙니다.";
    if (!form.agree) next.agree = "개인정보 수집 및 이용에 동의해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // 제출 시 검증 통과하면 확인 모달 오픈
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) setConfirmOpen(true);
  };

  // 모달 "확인" — 모의 전송(800ms) 후 성공 상태로 전환하고 폼 초기화
  const confirmSubmit = () => {
    setLoading(true);
    // TODO: 실제 Server Action / API 호출로 교체 (예: await submitEstimate(form))
    setTimeout(() => {
      setLoading(false);
      setConfirmOpen(false);
      setDone(true);
      setForm(INITIAL);
      setErrors({});
    }, 800);
  };

  // 모달 열림 시 ESC 로 닫기 + "확인" 버튼에 포커스 (간이 포커스 트랩)
  useEffect(() => {
    if (!confirmOpen) return;
    confirmBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) setConfirmOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen, loading]);

  return (
    <section id="estimate" className="scroll-mt-20 bg-neutral-100 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5">
        {/* 섹션 헤더 */}
        <Reveal className="text-center">
          <p className="eyebrow">FREE ESTIMATE</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">무료 방문 견적 서비스</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-600">
            저희 {SITE.nameKo}은 고객님께 최상의 서비스로 다가가기 위해 무료방문 견적 서비스를 시행하고 있습니다.
            <br className="hidden md:block" />
            신청서를 작성해주시면 해피콜을 드린 후 무료 방문해드립니다.
          </p>
        </Reveal>

        {done ? (
          // 접수 완료 안내 — 다시 작성 버튼으로 폼 복귀
          <div className="mt-12 rounded-md border border-neutral-200 bg-white p-10 text-center">
            <p className="text-lg font-medium">접수되었습니다. 곧 연락드리겠습니다.</p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-6 text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
            >
              추가로 신청하기
            </button>
          </div>
        ) : (
          <Reveal delay={120}>
            <form onSubmit={onSubmit} noValidate className="mt-12 space-y-7">
              {/* 이름 */}
              <Field label="이름" required error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="이름을 입력하세요"
                  className={inputCls}
                  aria-invalid={!!errors.name}
                />
              </Field>

              {/* 연락가능번호 */}
              <Field label="연락가능번호" required error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="010-0000-0000"
                  className={inputCls}
                  aria-invalid={!!errors.phone}
                />
              </Field>

              {/* 방문희망주소 */}
              <Field label="방문희망주소">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="시/구/동까지 입력해주세요"
                  className={inputCls}
                />
              </Field>

              {/* 설치장소 — 단일 선택 라디오 pill */}
              <Field label="설치장소 (선택)">
                <div role="radiogroup" className="flex flex-wrap gap-2 pt-1">
                  {PLACE_OPTIONS.map((p) => (
                    <label key={p} className={pillCls(form.place === p)}>
                      <input
                        type="radio"
                        name="place"
                        value={p}
                        checked={form.place === p}
                        onChange={() => set("place", p)}
                        className="sr-only"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </Field>

              {/* 방문희망날짜 */}
              <Field label="방문희망날짜">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className={`${inputCls} max-w-xs`}
                />
              </Field>

              {/* 희망제품 — 다중 선택 체크박스 pill */}
              <Field label="희망제품 (선택)">
                <div className="flex flex-wrap gap-2 pt-1">
                  {PRODUCT_OPTIONS.map((p) => {
                    const on = form.products.includes(p);
                    return (
                      <label key={p} className={pillCls(on)}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleProduct(p)}
                          className="sr-only"
                        />
                        {p}
                      </label>
                    );
                  })}
                </div>
              </Field>

              {/* 문의내용 */}
              <Field label="문의내용" align="start">
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="창 개수, 사이즈, 원하시는 스타일 등을 적어주세요"
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {/* 개인정보 수집 및 이용 동의 — 접이식 안내 박스 + 필수 체크 */}
              <div className="rounded-md border border-neutral-200 bg-white">
                {/* 토글 버튼: 클릭 시 안내문 펼침/접힘, 쉐브론 회전 */}
                <button
                  type="button"
                  onClick={() => setPrivacyOpen((v) => !v)}
                  aria-expanded={privacyOpen}
                  aria-controls="privacy-text"
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
                >
                  개인정보 수집 및 이용 동의
                  <svg
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 transition-transform duration-300 ${privacyOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 8l5 5 5-5" />
                  </svg>
                </button>
                {/* grid-rows 트릭으로 높이 애니메이션 (0fr ↔ 1fr) */}
                <div
                  id="privacy-text"
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    privacyOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* 플레이스홀더 약관 문구 — 실제 개인정보처리방침으로 교체 필요 */}
                    <div className="max-h-40 space-y-3 overflow-auto border-t border-neutral-100 px-4 py-3 text-xs leading-relaxed text-neutral-500">
                      <p>
                        1. 수집 항목: 이름, 연락처, 방문희망주소, 설치장소, 방문희망날짜, 희망제품, 문의내용. 위
                        항목은 무료 방문 견적 상담 및 해피콜 안내를 위해 수집됩니다.
                      </p>
                      <p>
                        2. 이용 목적: 견적 상담 일정 조율, 방문 견적 진행, 상담 이력 관리 및 서비스 안내. 수집된
                        정보는 명시된 목적 외의 용도로 이용되지 않습니다.
                      </p>
                      <p>
                        3. 보유 및 이용 기간: 상담 종료 후 1년까지 보관하며, 이후 지체 없이 파기합니다. 귀하는 동의를
                        거부할 권리가 있으나, 거부 시 견적 신청이 제한될 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
                <label className="flex cursor-pointer items-center gap-2 border-t border-neutral-100 px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => set("agree", e.target.checked)}
                    className="h-4 w-4 accent-neutral-900"
                    aria-invalid={!!errors.agree}
                  />
                  개인정보 수집 및 이용에 동의합니다.
                  <span className="text-red-500">*</span>
                </label>
                {errors.agree && <p className="px-4 pb-3 text-xs text-red-500">{errors.agree}</p>}
              </div>

              {/* 제출 */}
              <div className="pt-2 md:flex md:justify-center">
                <button
                  type="submit"
                  className="w-full bg-neutral-900 px-14 py-4 text-sm font-medium tracking-wider text-white transition-colors hover:bg-neutral-700 md:w-auto"
                >
                  신청하기
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>

      {/* 접수 확인 모달 — 배경 클릭/ESC/취소로 닫힘, 확인 시 전송 */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
          <button
            type="button"
            aria-label="닫기"
            tabIndex={-1}
            onClick={() => !loading && setConfirmOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="estimate-confirm-title"
            className="relative w-full max-w-sm rounded-md bg-white p-7 text-center shadow-2xl"
          >
            <p id="estimate-confirm-title" className="text-sm leading-relaxed">
              작성하신대로 접수하시겠습니까?
              <br />
              <span className="text-neutral-500">(연락처 오류시 상담이 불가합니다)</span>
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setConfirmOpen(false)}
                className="border border-neutral-300 py-2.5 text-sm transition-colors hover:bg-neutral-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                ref={confirmBtnRef}
                type="button"
                disabled={loading}
                onClick={confirmSubmit}
                className="bg-neutral-900 py-2.5 text-sm text-white transition-colors hover:bg-neutral-700 disabled:opacity-60"
              >
                {loading ? "접수 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// 라벨 + 입력 영역 레이아웃 (데스크톱: 좌측 라벨 / 모바일: 세로 스택)
function Field({
  label,
  required,
  error,
  align = "center",
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  align?: "center" | "start";
  children: ReactNode;
}) {
  return (
    <div className={`md:grid md:grid-cols-[140px_1fr] md:gap-6 ${align === "start" ? "md:items-start" : "md:items-center"}`}>
      <span className={`mb-1 block text-sm font-medium md:mb-0 ${align === "start" ? "md:pt-2" : ""}`}>
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <div>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
