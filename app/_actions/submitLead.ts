"use server";
// 상담 신청(DB 수집) 서버 액션.
// 검증 → 유입 정보(파워링크 키워드/UTM) 포함해 lead 객체 구성 → Neon DB 저장(재시도 포함) + 웹훅(선택) 전송.
// DB 와 웹훅 어디에도 못 남기면 실패로 답한다 — 고객이 다시 시도하거나 전화할 수 있게.
// LEAD_WEBHOOK_URL 환경변수에 Slack/Make/Zapier/Apps Script(구글시트) 웹훅을 넣으면 그대로 POST 됨.
import type { Attribution } from "../_lib/attribution";
import { inquiryStore } from "@/lib/store";

export type LeadInput = {
  name: string;
  phone: string;
  address?: string;    // 주소 (선택)
  date?: string;       // 희망 날짜 (선택)
  places?: string[];   // 설치 장소 (체크)
  products: string[];  // 설치 제품 (커튼/블라인드/상담 후 결정)
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
  if (!input.agree) return { ok: false, error: "개인정보 수집 및 이용에 동의해주세요." };

  const id = `L${Date.now().toString(36)}`;
  const lead = {
    id,
    createdAt: new Date().toISOString(),
    name: input.name.trim(),
    phone: input.phone.replace(/\s+/g, ""),
    address: input.address?.trim() || "",
    date: input.date || "",
    places: input.places ?? [],
    products: input.products ?? [],
    message: input.message?.trim() || "",
    // 유입 추적: 파워링크 키워드/매체/UTM/랜딩URL/리퍼러
    keyword: input.attribution?.n_keyword || input.attribution?.utm_term || input.attribution?.kw || "",
    source: input.attribution?.n_media || input.attribution?.utm_source || "direct",
    attribution: input.attribution ?? {},
    page: input.page ?? "",
  };

  // 신청 내용을 먼저 로그에 남긴다 — 아래 저장이 다 실패해도 Vercel 로그에서 "[lead]" 로 찾아 되살릴 수 있다
  console.log("[lead]", JSON.stringify(lead));

  // Neon DB 저장 — 관리자 페이지 '상담 관리'에 표시된다 (store 안에서 세 번까지 다시 시도한다).
  let dbSaved = false;
  try {
    await inquiryStore.create({
      name: lead.name,
      phone: lead.phone,
      note: lead.message,
      address: lead.address,
      hopeDate: lead.date,
      places: lead.places.join(", "),
      products: lead.products.join(", "),
      keyword: lead.keyword,
      source: lead.source,
      agree: true,
    });
    dbSaved = true;
  } catch (e) {
    console.error("[lead db] insert failed", e);
  }

  // 웹훅(선택) — LEAD_WEBHOOK_URL 이 있으면 DB 와 별개로 한 번 더 보낸다. DB 가 죽어도 여기로는 남는다.
  let webhookSent = false;
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      webhookSent = res.ok;
      if (!res.ok) console.error("[lead webhook] failed", res.status);
    } catch (e) {
      console.error("[lead webhook] error", e);
    }
  }

  // 어디에도 남기지 못했으면 성공한 척하지 않는다.
  // 예전에는 DB 가 죽어도 "접수 완료" 를 띄웠는데, 그러면 고객은 기다리고 업체는 모르는 채로 한 건이 그냥 사라진다.
  // 실패를 알려야 고객이 다시 시도하거나 전화를 건다.
  if (!dbSaved && !webhookSent) {
    console.error("[lead] 저장 실패 — DB·웹훅 모두 안 됨", id);
    return {
      ok: false,
      error: "접수가 저장되지 않았습니다. 잠시 후 다시 시도하시거나, 아래 번호로 전화 주시면 바로 도와드리겠습니다.",
    };
  }

  return { ok: true, id };
}
