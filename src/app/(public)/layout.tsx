import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link"; // Make sure to import Link

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main>{children}</main>
      <Footer />

      <Link
        href="/donation"
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-yellow-600 text-white font-bold py-5 px-7 rounded-full shadow-lg z-50 transition-transform hover:scale-110"
      >
        💛 DONATE
      </Link>
    </>
  );
}
