// 상담 신청 전송 공통 함수 — 4단계 폼(EstimateWizard)과 간편 견적(QuickEstimateCard)이 같이 쓴다.
// 서버 액션으로 보내고, 호출 자체가 실패하면 같은 내용을 REST 경로(/api/inquiries)로 한 번 더 보낸다.
import { submitLead, type LeadInput, type LeadResult } from "../_actions/submitLead";

export const LEAD_SAVE_ERROR =
  "접수가 저장되지 않았습니다. 잠시 후 다시 시도하시거나, 아래 번호로 전화 주시면 바로 도와드리겠습니다.";

export async function sendLead(payload: LeadInput): Promise<LeadResult> {
  try {
    return await submitLead(payload);
  } catch {
    // 서버 액션 호출 자체가 실패한 경우 — 배포 직후 옛 화면을 열어 둔 채 누르면 액션을 못 찾고,
    // 네트워크가 잠깐 끊겨도 여기로 온다. 같은 내용을 REST 경로로 다시 보내 본다.
    try {
      const attr = payload.attribution ?? {};
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          phone: payload.phone,
          note: payload.message ?? "",
          address: payload.address ?? "",
          hopeDate: payload.date ?? "",
          places: payload.places ?? [],
          products: payload.products,
          keyword: attr.n_keyword || attr.utm_term || attr.kw || "",
          source: attr.n_media || attr.utm_source || "direct",
          agree: payload.agree,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const item = (await res.json()) as { id?: string };
      return { ok: true, id: item.id ?? "" };
    } catch {
      return { ok: false, error: LEAD_SAVE_ERROR };
    }
  }
}
