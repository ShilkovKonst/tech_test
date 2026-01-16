import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  // Пример payload'а:
  // {
  //   event: "ACCOUNT_CONNECTED",
  //   account_id: "QO-WyMcDSmewDZfIQ7NJIQ",
  //   provider: "LINKEDIN",
  //   name: "user-123"
  // }
  console.log(payload);
  if (payload.event === "ACCOUNT_CONNECTED") {
    // addAccount({
    //   accountId: payload.account_id,
    //   provider: payload.provider,
    //   connectedAt: new Date().toISOString(),
    // });
  }

  return NextResponse.json({ ok: true });
}
