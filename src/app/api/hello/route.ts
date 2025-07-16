import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "World";

  return NextResponse.json({
    message: `Hello ${name}!`,
    timestamp: new Date().toISOString(),
  });
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    return NextResponse.json({
      message: "Data received successfully",
      data: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
  }
};
