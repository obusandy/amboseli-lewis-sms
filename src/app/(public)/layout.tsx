'use client'; // Important pour pouvoir utiliser usePathname

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from 'next/navigation';
import Link from "next/link";

const hiddenFooterRoutes = ['/mission', '/donation'];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showFooter = !hiddenFooterRoutes.includes(pathname);

  return (
    <>
      <Navbar />

      <main>{children}</main>

      {showFooter && <Footer />}

      <Link
        href="/donation"
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-yellow-600 text-white font-bold py-5 px-7 rounded-full shadow-lg z-50 transition-transform hover:scale-110"
      >
        💛 DONATE
      </Link>
    </>
  );
}
