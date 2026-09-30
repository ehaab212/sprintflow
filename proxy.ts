import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Next.js 16 requires a named `proxy` export (the `middleware` file convention
// and `export default` pattern are deprecated in v16). Auth.js's `.auth` property
// is already callable as a proxy handler — we simply alias it.
const { auth } = NextAuth(authConfig);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const proxy = auth as unknown as (request: any) => any;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
