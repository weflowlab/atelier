import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 이미지 최적화 비활성화
    // public/images 의 파일을 이미 WebP 로 변환해 두었으므로(원본 약 12.4MB → 0.7MB)
    // Vercel 의 이미지 최적화(유료 변환)를 거치지 않고 원본을 그대로 서빙한다.
    // next/image 는 그대로 쓰되 /_next/image 변환 요청이 발생하지 않는다.
    unoptimized: true,
  },
};

export default nextConfig;
