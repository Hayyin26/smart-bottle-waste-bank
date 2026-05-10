import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Routes yang butuh login
  const protectedRoutes = ['/dashboard', '/history', '/laporan', '/nasabah', '/transaksi', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Cek session dari cookies Supabase
  const authToken = request.cookies.get('sb-auth-token')?.value || 
                    request.cookies.get('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token')?.value;

  // Cara lain: cek dengan fetch ke Supabase untuk validasi session
  let hasSession = false;

  if (authToken) {
    hasSession = true;
  } else {
    // Alternative: cek cookies supabase yang lebih spesifik
    const cookies = request.cookies.getAll();
    hasSession = cookies.some(cookie => 
      cookie.name.includes('supabase') || 
      cookie.name.includes('auth') ||
      cookie.name.includes('session')
    );
  }

  // Jika akses route yang dilindungi tanpa session, redirect ke /login
  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login dan mengakses /login atau /register, redirect ke dashboard
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && hasSession) {
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
