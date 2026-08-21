// Neon(Postgres) 테이블 접근 계층 — 라우트는 여기만 통해 DB에 닿는다.
// 테이블 3개: inquiries(상담 신청) / faqs(자주 묻는 질문) / page_views(방문 기록)
// DB는 snake_case, 앱은 camelCase — 사이의 변환은 각 to*() 함수가 담당한다.

import { getSql } from "./db";

export type Status = "pending" | "in_progress" | "done";

// 아뜰리에 상담 폼 필드에 맞춰 확장 (주소/희망날짜/설치장소/설치제품/유입키워드)
export interface Inquiry {
  id: string;
  status: Status;
  name: string;
  phone: string;
  note: string; // 문의 내용
  address: string;
  hopeDate: string; // 시공 희망 날짜
  places: string; // 설치 장소 (예: "아파트/주거")
  products: string; // 설치 제품 (쉼표 구분)
  keyword: string; // 파워링크 유입 키워드
  source: string;
  agree: boolean;
  createdAt: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
}

// timestamptz 는 Date 로 오므로 ISO 문자열로 맞춘다 (앱 전체가 문자열을 기대한다)
function toIso(v: unknown): string {
  return v instanceof Date ? v.toISOString() : String(v ?? "");
}

function toInquiry(row: Record<string, unknown>): Inquiry {
  return {
    id: row.id as string,
    status: row.status as Status,
    name: row.name as string,
    phone: row.phone as string,
    note: (row.note as string) || "",
    address: (row.address as string) || "",
    hopeDate: (row.hope_date as string) || "",
    places: (row.places as string) || "",
    products: (row.products as string) || "",
    keyword: (row.keyword as string) || "",
    source: (row.source as string) || "web",
    agree: (row.agree as boolean) || false,
    createdAt: toIso(row.created_at),
  };
}

function toFaq(row: Record<string, unknown>): Faq {
  return {
    id: row.id as string,
    question: row.question as string,
    answer: (row.answer as string) || "",
    published: (row.published as boolean) ?? true,
    sortOrder: (row.sort_order as number) ?? 0,
    createdAt: toIso(row.created_at),
  };
}

export const inquiryStore = {
  getAll: async (): Promise<Inquiry[]> => {
    const sql = getSql();
    const rows = await sql`SELECT * FROM inquiries ORDER BY created_at DESC`;
    return rows.map(toInquiry);
  },

  create: async (
    input: Omit<Inquiry, "id" | "status" | "createdAt">,
  ): Promise<Inquiry> => {
    const sql = getSql();
    const rows = await sql`
      INSERT INTO inquiries
        (status, name, phone, note, address, hope_date, places, products, keyword, source, agree)
      VALUES ('pending', ${input.name}, ${input.phone}, ${input.note ?? ""},
              ${input.address ?? ""}, ${input.hopeDate ?? ""}, ${input.places ?? ""},
              ${input.products ?? ""}, ${input.keyword ?? ""},
              ${input.source ?? "web"}, ${input.agree ?? false})
      RETURNING *`;
    return toInquiry(rows[0]);
  },

  // 관리자 화면에서 바꾸는 값은 상태뿐이라 status 만 반영한다
  update: async (id: string, patch: Partial<Inquiry>): Promise<Inquiry | null> => {
    if (!patch.status) return null;
    const sql = getSql();
    const rows = await sql`
      UPDATE inquiries SET status = ${patch.status} WHERE id = ${id} RETURNING *`;
    return rows.length ? toInquiry(rows[0]) : null;
  },

  delete: async (id: string): Promise<boolean> => {
    const sql = getSql();
    const rows = await sql`DELETE FROM inquiries WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  },
};

export const faqStore = {
  // 관리자용 — 비공개 포함 전체. 노출 순서와 동일하게 등록 순.
  getAll: async (): Promise<Faq[]> => {
    const sql = getSql();
    const rows = await sql`SELECT * FROM faqs ORDER BY sort_order ASC`;
    return rows.map(toFaq);
  },

  // 사이트 노출용 — 공개된 것만
  getPublished: async (): Promise<Faq[]> => {
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM faqs WHERE published = true ORDER BY sort_order ASC`;
    return rows.map(toFaq);
  },

  // 새 질문은 목록 맨 아래로 (sort_order 를 현재 최댓값보다 크게)
  create: async (
    input: Omit<Faq, "id" | "createdAt" | "sortOrder">,
  ): Promise<Faq> => {
    const sql = getSql();
    const rows = await sql`
      INSERT INTO faqs (question, answer, published, sort_order)
      VALUES (${input.question}, ${input.answer ?? ""}, ${input.published ?? true},
              COALESCE((SELECT MAX(sort_order) FROM faqs), -1) + 1)
      RETURNING *`;
    return toFaq(rows[0]);
  },

  // 화면에 보이는 순서(ids)를 그대로 0,1,2… 로 굳힌다.
  // 두 행을 교환하는 방식보다 안전하다 (동시 수정 시 순번이 꼬이지 않음).
  reorder: async (ids: string[]): Promise<boolean> => {
    if (!ids.length) return true;
    const sql = getSql();
    const rows = await sql`
      UPDATE faqs AS f SET sort_order = v.ord - 1
      FROM unnest(${ids}::uuid[]) WITH ORDINALITY AS v(id, ord)
      WHERE f.id = v.id
      RETURNING f.id`;
    return rows.length === ids.length;
  },

  // 관리자가 보내는 필드는 question/answer/published 뿐이다.
  update: async (id: string, patch: Partial<Faq>): Promise<Faq | null> => {
    const sql = getSql();
    const rows = await sql`
      UPDATE faqs SET
        question  = COALESCE(${patch.question ?? null}::text, question),
        answer    = COALESCE(${patch.answer ?? null}::text, answer),
        published = COALESCE(${patch.published ?? null}::boolean, published)
      WHERE id = ${id}
      RETURNING *`;
    return rows.length ? toFaq(rows[0]) : null;
  },

  delete: async (id: string): Promise<boolean> => {
    const sql = getSql();
    const rows = await sql`DELETE FROM faqs WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  },
};

export interface PageView {
  id: string;
  sessionId: string;
  path: string;
  referrer: string;
  source: string;
  medium: string;
  campaign: string;
  device: string;
  durationMs: number | null;
  maxScroll: number | null;
  createdAt: string;
}

function toPageView(row: Record<string, unknown>): PageView {
  return {
    id: row.id as string,
    sessionId: row.session_id as string,
    path: row.path as string,
    referrer: (row.referrer as string) || "",
    source: (row.source as string) || "direct",
    medium: (row.medium as string) || "",
    campaign: (row.campaign as string) || "",
    device: (row.device as string) || "desktop",
    durationMs: (row.duration_ms as number) ?? null,
    maxScroll: (row.max_scroll as number) ?? null,
    createdAt: toIso(row.created_at),
  };
}

export const pageViewStore = {
  // 최근 N일 방문 기록 (관리자 통계 집계용). days=null 이면 기간 제한 없이 전체.
  getRecent: async (days: number | null = 30): Promise<PageView[]> => {
    const sql = getSql();
    const since =
      days == null
        ? null
        : new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const rows = await sql`
      SELECT * FROM page_views
      WHERE ${since}::timestamptz IS NULL OR created_at >= ${since}::timestamptz
      ORDER BY created_at ASC, id ASC`;
    return rows.map(toPageView);
  },

  create: async (input: {
    sessionId: string;
    path: string;
    referrer: string;
    source: string;
    medium: string;
    campaign: string;
    device: string;
  }): Promise<{ id: string }> => {
    const sql = getSql();
    const rows = await sql`
      INSERT INTO page_views (session_id, path, referrer, source, medium, campaign, device)
      VALUES (${input.sessionId}, ${input.path}, ${input.referrer},
              ${input.source}, ${input.medium}, ${input.campaign}, ${input.device})
      RETURNING id`;
    return { id: rows[0].id as string };
  },

  // 페이지 이탈 시 체류시간 + 스크롤 최대 도달률 기록
  setDuration: async (
    id: string,
    durationMs: number,
    maxScroll?: number,
  ): Promise<void> => {
    const sql = getSql();
    if (typeof maxScroll === "number") {
      await sql`
        UPDATE page_views SET duration_ms = ${durationMs}, max_scroll = ${maxScroll}
        WHERE id = ${id}`;
    } else {
      await sql`UPDATE page_views SET duration_ms = ${durationMs} WHERE id = ${id}`;
    }
  },
};
