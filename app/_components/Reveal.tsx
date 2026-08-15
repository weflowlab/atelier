"use client";
// 자식을 감싸면 뷰포트 진입 시 페이드업. delay(ms)로 순차 등장 연출.
import type { ReactNode } from "react";
import { useReveal } from "../_hooks/useReveal";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} data-reveal style={{ transitionDelay: `${delay}ms` }} className={className}>
      {children}
    </Tag>
  );
}
