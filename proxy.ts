import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "./app/utils/jwt";
import { cookies } from "next/headers";
import { getRefreshToken } from "./service/refreshToken";
import { getSubscriptionStatus } from "./app/(publicGroup)/_actions/getSubscriptionStatus";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/news"];

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(pathname, "pathname");

  const cookieStore = await cookies();
  //   const accessToken = cookieStore.get("accessToken")?.value

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifiedToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      )
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifiedToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getRefreshToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      accessToken = newAccessToken;

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      decodedAccessToken = jwtUtils.verifiedToken(
        accessToken!,
        process.env.JWT_ACCESS_SECRET as string,
      );
    }
  }

  let userRole = null;

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

  if (!decodedAccessToken?.success) {
    // token has expired or his invalid, clear the cookies
    cookieStore.delete("accessToken");

    // return NextResponse.redirect(new URL("/login", request.url));
  }

  // user is logged in and trying to access login or register page. redirect to dashboard or root home page

  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else if (userRole === "AUTHOR") {
      return NextResponse.redirect(new URL("/author-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Authenticaiton pages protection: authoraization is not handle yet

  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authentication: Role Based access control
  if (pathname.startsWith("/dashboard") && userRole !== "USER") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (
    pathname.startsWith("/author-dashboard") &&
    userRole !== "AUTHOR"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }



  if (pathname === "/premium") {
    const subscriptionStatus = await getSubscriptionStatus();

    const isActive = Boolean(
      subscriptionStatus?.success && subscriptionStatus.data?.isSubscribed,
    );

    if (!isActive) {
      return NextResponse.redirect(new URL("/payment", request.url));
    }
  }

  //   if (pathname === "/payment") {
  //   const subscriptionStatus = await getSubscriptionStatus();

  //   const isActive = Boolean(
  //     subscriptionStatus?.success && subscriptionStatus.data?.isSubscribed,
  //   );

  //   if (isActive) {
  //     return NextResponse.redirect(new URL("/premium", request.url));
  //   }
  // }

  //   return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/dashboard/:path*",
    // "/admin-dashboard/:path*"

    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
