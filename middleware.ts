import { createClient } from "@/lib/supabase/middleware"
import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"

const FIXED_LOCALE = "en"

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  const { supabase, response } = createClient(request)

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  const isAuthRoute =
    pathname === `/${FIXED_LOCALE}/login` ||
    pathname === `/${FIXED_LOCALE}/signup` ||
    pathname === `/${FIXED_LOCALE}/reset-password` ||
    pathname.startsWith(`/${FIXED_LOCALE}/login/`)

  const isRoot = pathname === "/"
  const isPlainChat = pathname === "/chat"
  const isLocalizedRoot = pathname === `/${FIXED_LOCALE}`

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(
      new URL(`/${FIXED_LOCALE}/login`, request.url)
    )
  }

  if (session && (isRoot || isPlainChat || isLocalizedRoot)) {
    return NextResponse.redirect(
      new URL(`/${FIXED_LOCALE}/chat`, request.url)
    )
  }

  return response
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)"
}
