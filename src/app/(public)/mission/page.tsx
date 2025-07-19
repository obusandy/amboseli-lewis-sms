'use client';

import { motion } from 'framer-motion';

export default function MissionPage() {
  return (
    <main className="px-6 py-16 max-w-3xl mx-auto text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-extrabold mb-8  top-10 text-center text-green-700 tracking-tight">
          Our Mission
        </h1>

        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            
            At <strong>Amboseli Lewis Secondary School</strong>,
             our mission is to provide quality education accessible to all young people,
              particularly in rural Kenya.
          </p>

          <p>
            We firmly believe that every child deserves the opportunity to succeed,
             and we are committed to creating a safe, inclusive, and stimulating learning environment.
          </p>

          <p>
            Nos enseignants dévoués, nos activités parascolaires enrichissantes
            et notre engagement communautaire font partie intégrante de notre
            vision pour l’avenir.
            Our dedicated teachers, enriching extracurricular activities, and community engagement are integral parts of our vision for the future.

          </p>

          <p>
            
            

<span className="font-semibold text-green-800">Join us</span> on this educational adventure and help build a better future!
          </p>
        </div>
      </motion.div>
    </main>
  );
}
