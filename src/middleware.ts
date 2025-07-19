// middleware.ts

// This is the direct export of the default NextAuth.js middleware.
// It is the simplest and most reliable way to protect routes.
export { default } from "next-auth/middleware";

// The config object tells the middleware which paths to protect.
export const config = {
  // This single line protects EVERY page and sub-page inside your /admin folder.
  // It is the only rule you need.
  matcher: ["/admin/:path*"],
};
