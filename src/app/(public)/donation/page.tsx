import Navbar from "@/components/Navbar";
export default function DonationPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Support our mission 💛</h1>
        <p className="text-lg max-w-xl">
          Your contribution helps provide more educational resources to young people.
        </p>
        {/* Ici tu peux ajouter un formulaire de paiement, lien PayPal, etc. */}
      </div>
    </>
  );
}
