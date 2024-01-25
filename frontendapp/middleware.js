import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("middleware ran");
  console.log(request);
  //   return NextResponse.json({ sucess: "Succces rna " });
  NextResponse.redirect(new URL("/images", request.url));
}

// the routes that you want the middlware to affect in the client

// :path   this if the dynamic route
// * for any route segment going onwards
export const config = {
  matcher: ["/google-fonts/:path*"],
};
