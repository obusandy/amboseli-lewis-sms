
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export default function DonationPage() {
  return (
    <>
      <Navbar />
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Soutenez notre mission 💛</h1>
      <p className="text-lg max-w-xl">
        Votre contribution aide à offrir plus de ressources éducatives aux jeunes.
      </p>
      {/* Ici tu peux ajouter un formulaire de paiement, lien PayPal, etc. */}
    </div>
      <Footer />
      </>
  )
}
