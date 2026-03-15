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

  const isLocalizedLogin =
    pathname === `/${FIXED_LOCALE}/login` ||
    pathname.startsWith(`/${FIXED_LOCALE}/login?`)

  const isLocalizedSignup =
    pathname === `/${FIXED_LOCALE}/signup` ||
    pathname.startsWith(`/${FIXED_LOCALE}/signup?`)

  const isLocalizedResetPassword =
    pathname === `/${FIXED_LOCALE}/reset-password` ||
    pathname.startsWith(`/${FIXED_LOCALE}/reset-password?`)

  const isAuthRoute =
    isLocalizedLogin || isLocalizedSignup || isLocalizedResetPassword

  const isRoot = pathname === "/"
  const isPlainChat = pathname === "/chat"

  // Not logged in → force localized login
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(
      new URL(`/${FIXED_LOCALE}/login`, request.url)
    )
  }

  // Logged in at root or /chat → send to the user's real home workspace
  if (session && (isRoot || isPlainChat)) {
    const { data: homeWorkspace, error } = await supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("is_home", true)
      .single()

    if (!homeWorkspace) {
      throw new Error(error?.message || "Home workspace not found")
    }

    return NextResponse.redirect(
      new URL(`/${FIXED_LOCALE}/${homeWorkspace.id}/chat`, request.url)
    )
  }

  return response
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)"
}
