import { createClient } from "@/lib/supabase/middleware"
import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"

const FIXED_LOCALE = "en"
const FIXED_WORKSPACE = "zodistar"

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  const { supabase, response } = createClient(request)

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  const isAuthRoute =
  pathname.startsWith("/login") ||
  pathname.startsWith("/signup") ||
  pathname.startsWith("/reset-password")
  
  const isRoot = pathname === "/"
  const isPlainChat = pathname === "/chat"

  // 🔒 Not logged in → force login
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // ✅ Logged in at root → force fixed workspace chat
  if (session && isRoot) {
    return NextResponse.redirect(
      new URL(`/${FIXED_LOCALE}/${FIXED_WORKSPACE}/chat`, request.url)
    )
  }

  // ✅ Logged in hitting /chat directly → rewrite to fixed workspace
  if (session && isPlainChat) {
    return NextResponse.redirect(
      new URL(`/${FIXED_LOCALE}/${FIXED_WORKSPACE}/chat`, request.url)
    )
  }

  return response
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)"
}