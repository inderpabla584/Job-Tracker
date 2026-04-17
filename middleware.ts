import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  // Create a Supabase client that can read/write the session cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Proxy convention: build a new Headers object with the merged cookie
          // string instead of mutating request.cookies (deprecated)
          const requestHeaders = new Headers(request.headers)
          const jar = new Map(
            request.cookies.getAll().map(({ name, value }) => [name, value])
          )
          cookiesToSet.forEach(({ name, value }) => jar.set(name, value))
          requestHeaders.set(
            'cookie',
            [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ')
          )
          response = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session if it has expired — must use getUser(), not getSession()
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  // Unauthenticated user trying to access a protected page
  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Authenticated user hitting an auth page — send them to the app
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/applications'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
