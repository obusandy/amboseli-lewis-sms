"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MissionPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-green-700">
          Notre Mission
        </h1>
        <p className="text-lg leading-relaxed text-gray-800">
          À Amboseli Lewis Secondary School, notre mission est de fournir une
          éducation de qualité, accessible à tous les jeunes, en particulier
          dans les zones rurales du Kenya.
          <br />
          <br />
          Nous croyons fermement que chaque enfant mérite l’opportunité de
          réussir, et nous nous engageons à créer un environnement
          d’apprentissage sûr, inclusif et stimulant.
          <br />
          <br />
          Nos enseignants dévoués, nos activités parascolaires enrichissantes et
          notre engagement communautaire font partie intégrante de notre vision
          pour l’avenir.
          <br />
          <br />
          Rejoignez-nous dans cette aventure éducative et contribuez à
          construire un avenir meilleur !
        </p>
      </main>
    </>
  );
}
