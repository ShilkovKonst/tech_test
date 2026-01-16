import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    `https://${process.env.UNIPILE_BASE_URL}/api/v1/accounts`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": process.env.UNIPILE_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: text }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
