-- 커튼장인 아뜰리에 스키마 — Neon(Postgres)
-- Neon 콘솔의 SQL Editor에 붙여넣고 실행하세요. 여러 번 실행해도 안전합니다.
--
-- 권한 통제는 DB가 아니라 앱의 서버 라우트가 한다.
-- 브라우저는 DB를 직접 호출하지 않는다 — DATABASE_URL 은 서버에만 있고,
-- 관리자 전용 라우트는 lib/adminAuth.ts 의 httpOnly 쿠키로 검증한다.

-- ── 상담 신청 (랜딩 폼) ────────────────────────────────────
create table if not exists inquiries (
  id          uuid primary key default gen_random_uuid(),
  status      text not null default 'pending'
              check (status in ('pending', 'in_progress', 'done')),
  name        text not null,
  phone       text not null,
  note        text not null default '',   -- 문의 내용
  address     text not null default '',   -- 주소
  hope_date   text not null default '',   -- 시공 희망 날짜
  places      text not null default '',   -- 설치 장소
  products    text not null default '',   -- 설치 제품 (쉼표 구분)
  keyword     text not null default '',   -- 파워링크 유입 키워드
  source      text not null default 'web',
  agree       boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on inquiries (created_at desc);

-- ── 자주 묻는 질문 ─────────────────────────────────────────
-- 노출 순서 = sort_order 오름차순 (관리자에서 위/아래 화살표로 조정).
create table if not exists faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null default '',
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists faqs_order_idx on faqs (sort_order asc);

-- ── 방문 추적 (관리자 '유입 관리') ─────────────────────────
create table if not exists page_views (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,              -- 기기ID + KST 날짜 → 같은 날 같은 기기는 1명
  path        text not null,
  referrer    text not null default '',
  source      text not null default 'direct',  -- naver / google / kakao / instagram …
  medium      text not null default '',        -- utm_medium
  campaign    text not null default '',        -- utm_campaign
  device      text not null default 'desktop', -- mobile / tablet / desktop
  duration_ms int,                             -- 이탈 시 기록 (체류시간)
  max_scroll  int,                             -- 이탈 시 기록 (0~100, 최대 스크롤 도달률)
  created_at  timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on page_views (created_at);
create index if not exists page_views_session_idx    on page_views (session_id);
