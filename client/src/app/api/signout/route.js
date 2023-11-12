import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const cookie = cookies();
  const session = cookie.get("session");
  cookie.delete("session");

  return new NextResponse("ok");
}
