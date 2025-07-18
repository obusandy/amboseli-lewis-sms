'use client';

import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo avec image */}
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image
              src="/images/logo.png" // ← Assure-toi que le fichier existe dans public/
              alt="Logo Amboseli Secondary School"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-lg font-bold text-green-700 hidden sm:block">
              Amboseli Secondary School
            </span>
          </div>
        </Link>

        {/* Liens de navigation */}
             <Link href="/" className="hover:text-green-600">
  Home
</Link>
     <Link href="#about" className="hover:text-green-600">
  About
</Link>

<Link href="#activities" className="hover:text-green-600">
  Activities
</Link>
<Link href="#contact" className="hover:text-green-600">
  Contact
</Link>
<Link href="/mission" className="hover:text-green-600">
  Our Mission
</Link>
<Link href="/donation" className="hover:text-green-600">
  Donation
</Link>

        {/* Menu mobile (pour plus tard si tu veux) */}
        <button className="md:hidden text-green-700 focus:outline-none">
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
