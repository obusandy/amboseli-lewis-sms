"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Footer() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const adminLink =
    status === "authenticated" && isAdmin ? "/admin/dashboard" : "/login";

  return (
    <footer className="bg-white text-white py-2 px-2">
      <div className="max-w-7xl mx-auto  mt-25 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Adresse */}
        <div>
          <h3 className="text-lg text-black font-semibold mb-3">📍 Adresse</h3>
          <p className="text-black leading-relaxed text-sm">
            Amboseli lewis Secondary School<br />
            Kenya, Kajiado
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg text-black  font-semibold mb-3">📞 Contact</h3>
          <p className="text-black text-sm">Tél : +254 700 000 000</p>
          <p className="text-black text-sm">Email : ecole@example.com</p>
        </div>

        {/* Navigation rapide */}
        {/* Tu peux ajouter ici plus tard si besoin */}

        {/* Admin */}
        <div>
          <h3 className="text-lg text-black font-semibold mb-3">🔒 Admin</h3>
          <p className="text-black text-sm mb-2">
            Réservé au personnel administratif
          </p>
          <Link
            href={adminLink}
            className="inline-block bg-green-600 hover:bg-black text-white text-sm px-4 py-2 rounded transition"
          >
            {status === "authenticated" && isAdmin
              ? "Dashboard Admin"
              : "Espace Admin"}
          </Link>
        </div>

        {/* Google Maps */}
        <div>
          <h3 className="text-lg text-black font-semibold mb-3">🗺️ Localisation</h3>
          <div className="w-full h-40 rounded overflow-hidden border border-gray-300">
            <iframe
              title="Carte Amboseli"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.1856574267!2d37.2430773!3d-2.6459374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f5c10a7baf97d%3A0x75a0e623914a57e6!2sAmboseli%2C%20Kenya!5e0!3m2!1sen!2ske!4v1721234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-xs">
        © Copyright 2025 Amboseli Lewis SMS Secondary School.
      </div>
    </footer>
  );
}
