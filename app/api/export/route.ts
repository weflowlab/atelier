import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { inquiryStore } from "@/lib/store";
import { isAdmin } from "@/lib/adminAuth";

const STATUS_KO: Record<string, string> = {
  pending: "대기",
  in_progress: "진행중",
  done: "완료",
};

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rows = (await inquiryStore.getAll()).map((i) => ({
    상태: STATUS_KO[i.status] ?? i.status,
    이름: i.name,
    연락처: i.phone,
    주소: i.address,
    "설치 장소": i.places,
    "설치 제품": i.products,
    "희망 날짜": i.hopeDate,
    "문의 내용": i.note,
    "유입 키워드": i.keyword,
    출처: i.source,
    "개인정보 동의": i.agree ? "동의" : "-",
    접수일: new Date(i.createdAt).toLocaleString("ko-KR"),
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "상담문의");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const filename = `커튼장인_상담문의_${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
    },
  });
}
