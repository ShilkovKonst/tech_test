import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "account id is required" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://${process.env.UNIPILE_BASE_URL}/api/v1/accounts/${id}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "account id is required" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://${process.env.UNIPILE_BASE_URL}/api/v1/accounts/${id}`,
    {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "X-API-KEY": process.env.UNIPILE_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: text }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
