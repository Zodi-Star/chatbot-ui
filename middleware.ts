import { createClient } from "@/lib/supabase/middleware"
import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  const { supabase, response } = createClient(request)

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")
  const isRoot = request.nextUrl.pathname === "/"

  // If not logged in and trying to access app, redirect to login
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If logged in and at root, redirect to /chat
  if (session && isRoot) {
    return NextResponse.redirect(new URL("/chat", request.url))
  }

  return response
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)"
}