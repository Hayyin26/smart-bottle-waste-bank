import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Routes yang butuh login
  const protectedRoutes = ['/dashboard', '/history', '/laporan', '/nasabah', '/transaksi', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Cek session dari cookies Supabase dengan lebih ketat
  const cookies = request.cookies.getAll();
  
  // Cari cookie auth yang spesifik (bukan keyword umum)
  let hasValidAuthCookie = false;
  
  for (const cookie of cookies) {
    // Check untuk standard Supabase auth tokens
    if (cookie.name.includes('auth-token') || 
        cookie.name === 'sb-auth-token' ||
        cookie.name.includes('sb-') && cookie.name.includes('-auth-token') ||
        cookie.name === 'supabase-auth' ||
        (cookie.name.startsWith('sb-') && cookie.value && cookie.value.length > 20)) {
      // Verify cookie punya value
      if (cookie.value && cookie.value.trim().length > 0) {
        hasValidAuthCookie = true;
        break;
      }
    }
  }

  // Jika akses route yang dilindungi tanpa valid auth cookie, redirect ke /login
  if (isProtectedRoute && !hasValidAuthCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah ada auth cookie dan akses /login atau /register, redirect ke dashboard
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && hasValidAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
