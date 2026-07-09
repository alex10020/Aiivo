/* Session refresh + auth guard for the dashboard. Runs only on /app/**.
   Without Supabase env it redirects to /signin (which shows the connect
   notice), so the app degrades instead of crashing. */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Dev-only dashboard preview: with no Supabase configured, `next dev`
    // renders /app with sample data. Production builds still redirect.
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(all) {
        for (const { name, value } of all) req.cookies.set(name, value);
        res = NextResponse.next({ request: req });
        for (const { name, value, options } of all)
          res.cookies.set(name, value, options);
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const to = new URL("/signin", req.url);
    to.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(to);
  }
  return res;
}

export const config = {
  matcher: ["/app/:path*"],
};
