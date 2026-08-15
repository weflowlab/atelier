// 루트 레이아웃: 폰트 로드 + 메타데이터. 헤더/푸터는 page.tsx 에서 조립.
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "./_lib/data";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${SITE.name} | 커튼 & 블라인드`,
  description: "트렌디하고 젊은 감성의 커튼 & 블라인드. 무료 방문 견적 서비스.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
