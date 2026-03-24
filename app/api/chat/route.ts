import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // TEMP: echo response so UI works
    return new Response(
      JSON.stringify({
        role: "assistant",
        content: "Test response working"
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}
