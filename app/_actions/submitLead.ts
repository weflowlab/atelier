"use server";
// 상담 신청(DB 수집) 서버 액션.
// 검증 → 유입 정보(파워링크 키워드/UTM) 포함해 lead 객체 구성 → 웹훅(선택) 전송.
// LEAD_WEBHOOK_URL 환경변수에 Slack/Make/Zapier/Apps Script(구글시트) 웹훅을 넣으면 그대로 POST 됨.
import type { Attribution } from "../_lib/attribution";

export type LeadInput = {
  name: string;
  phone: string;
  region: string;
  products: string[];
  message?: string;
  agree: boolean;
  attribution?: Attribution;
  page?: string;
};
export type LeadResult = { ok: true; id: string } | { ok: false; error: string };

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  // 서버 측 재검증 (클라이언트 검증 우회 방지)
  if (!input.name?.trim()) return { ok: false, error: "성함을 입력해주세요." };
  if (!/^[0-9-+\s]{9,}$/.test(input.phone ?? "")) return { ok: false, error: "올바른 연락처를 입력해주세요." };
  if (!input.region?.trim()) return { ok: false, error: "설치 지역을 선택해주세요." };
  if (!input.agree) return { ok: false, error: "개인정보 수집 및 이용에 동의해주세요." };

  const id = `L${Date.now().toString(36)}`;
  const lead = {
    id,
    createdAt: new Date().toISOString(),
    name: input.name.trim(),
    phone: input.phone.replace(/\s+/g, ""),
    region: input.region,
    products: input.products ?? [],
    message: input.message?.trim() || "",
    // 유입 추적: 파워링크 키워드/매체/UTM/랜딩URL/리퍼러
    keyword: input.attribution?.n_keyword || input.attribution?.utm_term || input.attribution?.kw || "",
    source: input.attribution?.n_media || input.attribution?.utm_source || "direct",
    attribution: input.attribution ?? {},
    page: input.page ?? "",
  };

  // TODO: 실제 저장소 연결 (DB / 구글시트 / CRM). 우선 웹훅 + 서버 로그.
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) console.error("[lead webhook] failed", res.status);
    } catch (e) {
      console.error("[lead webhook] error", e);
    }
  }
  console.log("[lead]", JSON.stringify(lead));

  return { ok: true, id };
}
