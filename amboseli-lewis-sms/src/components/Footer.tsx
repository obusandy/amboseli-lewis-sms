'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h3 className="text-lg font-bold mb-2">📍 Adresse</h3>
          <p>Commune de Bandalungwa, Kinshasa<br />République Démocratique du Congo</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">📞 Contact</h3>
          <p>Tél : +243 900 000 000</p>
          <p>Email : ecole@example.com</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">🔗 Liens utiles</h3>
          <ul className="space-y-1">
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/about">À propos</Link></li>
            <li><Link href="/activites">Activités</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="flex flex-col items-start">
          <h3 className="text-lg font-bold mb-2">🔒 Admin</h3>
          <p className="mb-2 text-sm text-gray-400">Réservé au personnel administratif</p>
          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Espace Admin
          </Link>
        </div>

      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} École Secondaire. Tous droits réservés.
      </div>
    </footer>
  );
}
