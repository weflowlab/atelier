import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 이미지 최적화 비활성화 — Vercel 의 유료 이미지 변환(Image Optimization)을 타지 않는다.
    // public/images 는 이미 전량 WebP 로 변환·리사이즈해 두었다(133개 20.8MB).
    // 남은 PNG 12개(2.2MB)는 의도적: 로고·아이콘은 투명 배경이 필요하고,
    // og.png 는 일부 SNS 크롤러가 WebP 를 못 읽어 PNG 로 유지한다.
    // next/image 는 그대로 쓰되 /_next/image 변환 요청이 발생하지 않고 원본이 그대로 서빙된다.
    // → 이미지를 새로 추가할 때는 WebP 로 변환해서 넣어야 한다(자동 변환이 없음).
    unoptimized: true,
  },
};

export default nextConfig;
