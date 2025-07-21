'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

    const handleCloseMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Logo Amboseli Secondary School"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-semibold text-green-700 hidden sm:inline">
              Amboseli Secondary School
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink href="/" label="Home" />
            <NavLink href="#about" label="About" />
            <NavLink href="#activities" label="Activities" />
            <NavLink href="#contact" label="Contact" />
            <NavLink href="/mission" label="Our Mission" />
            <NavLink href="/donation" label="Donation" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-green-700 focus:outline-none"
              aria-label="Toggle menu"
            >
             {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 flex flex-col items-center space-y-4 bg-white p-4 rounded shadow-lg z-50">
            <NavLink href="/" label="Home"  onClick={handleCloseMenu}  />
            <NavLink href="#about" label="About" onClick={handleCloseMenu} />
            <NavLink href="#activities" label="Activities" onClick={handleCloseMenu} />
            <NavLink href="#contact" label="Contact" onClick={handleCloseMenu} />
            <NavLink href="/mission" label="Our Mission" onClick={handleCloseMenu} />
            <NavLink href="/donation" label="Donation"  onClick={handleCloseMenu}/>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({
  href,
  label,
  isButton = false,
  onClick,
}: {
  href: string;
  label: string;
  isButton?: boolean;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick} // ✅ Cela fonctionne maintenant
    className={`font-medium transition-all duration-200 ${
      isButton
        ? 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow-md'
        : 'text-gray-700 hover:text-green-600'
    }`}
  >
    {label}
  </Link>
);

export default Navbar;
