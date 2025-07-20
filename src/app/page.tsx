"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Amboseli Lewis School
      </h1>

      <div className="w-48 h-48 animate-[fadeInSlow]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          fill="#4b5563"
        >
          <path d="M640 256c0-17.7-14.3-32-32-32h-48v-40c0-61.9-50.1-112-112-112H416c0-13.3-10.7-24-24-24s-24 10.7-24 24v17.1C362.3 99.6 336.7 96 320 96c-49.6 0-97.3 26.6-123.6 69.5L157 248.5c-4.8 8-13.5 12.9-22.9 12.9H112c-8.8 0-16 7.2-16 16v64h-8c-26.5 0-48 21.5-48 48v56c0 8.8 7.2 16 16 16h64c11.7 0 22.4-5.1 29.9-13.2 10.4 8.2 23.4 13.2 37.6 13.2H400c61.9 0 112-50.1 112-112V304h48c17.7 0 32-14.3 32-32z" />
        </svg>
      </div>

      <p className="text-sm text-gray-600 mt-4">Loading</p>
    </main>
  );
}
