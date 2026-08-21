import { NextResponse } from "next/server";
import { inquiryStore } from "@/lib/store";
import { isAdmin } from "@/lib/adminAuth";

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await inquiryStore.getAll());
}

// 사이트 상담 폼 → 문의 접수 (공개) — 접수는 submitLead 서버 액션이 주 경로지만
// 외부 연동을 위해 REST 경로도 열어둔다. 필드는 아뜰리에 폼 기준.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { name, phone, note, address, hopeDate, places, products, keyword, agree, source } = body;
  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { error: "이름과 연락처는 필수 항목입니다." },
      { status: 400 },
    );
  }
  // 개인정보 수집·이용 동의는 법적 요건이므로 서버에서도 강제한다.
  if (agree !== true) {
    return NextResponse.json(
      { error: "개인정보 수집·이용 동의가 필요합니다." },
      { status: 400 },
    );
  }
  const item = await inquiryStore.create({
    name: name.trim(),
    phone: phone.trim(),
    note: note?.trim() || "",
    address: address?.trim() || "",
    hopeDate: hopeDate?.trim() || "",
    places: Array.isArray(places) ? places.join(", ") : places?.trim() || "",
    products: Array.isArray(products) ? products.join(", ") : products?.trim() || "",
    keyword: keyword?.trim() || "",
    agree: true,
    source: source || "web",
  });
  return NextResponse.json(item, { status: 201 });
}
