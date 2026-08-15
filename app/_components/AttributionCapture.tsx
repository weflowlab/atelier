"use client";
// 페이지 진입 시 광고 유입 파라미터(n_keyword/UTM/kw)를 sessionStorage 에 1회 저장. 렌더링 없음.
import { useEffect } from "react";
import { captureAttribution } from "../_lib/attribution";

export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
