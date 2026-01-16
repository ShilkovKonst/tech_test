import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const provider = searchParams.get("provider");

  const response = await fetch(
    `https://${process.env.UNIPILE_BASE_URL}/api/v1/hosted/accounts/link`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "X-API-KEY": process.env.UNIPILE_API_KEY!,
      },
      body: JSON.stringify({
        type: "create",
        providers: [provider],
        api_url: `https://${process.env.UNIPILE_BASE_URL}`,
        expiresOn: "2026-02-12T00:00:00.000Z",

        success_redirect_url: `${process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL}/?provider=${provider}&success=true`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL}/?error=true`,
        notify_url: "http://localhost:3000/api/unipile/webhook",
        name: "user-123",
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: text }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.redirect(data.url, 302);
}
