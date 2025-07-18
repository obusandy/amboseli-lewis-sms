'use client';

import Image from 'next/image';

export default function ActivitiesSection() {
  const activities = [
    {
      title: 'Atelier de Robotique',
      description: 'Les élèves apprennent à programmer et construire des robots en équipe.',
      image: '/images/masai.jpeg',
    },
    {
      title: 'Peinture et Dessin',
      description: 'Développer la créativité à travers l’art visuel.',
      image: '/images/foot.jpeg',
    },
    {
      title: 'Théâtre Scolaire',
      description: 'Renforcer la confiance en soi grâce à la scène et au jeu d’acteur.',
      image: '/images/dance.jpeg',
    },
    {
      title: 'Activités Sportives',
      description: 'Favoriser l’esprit d’équipe et le bien-être physique.',
      image: '/images/kilima.jpeg',
    },
  ];

  return (
    <section id="activites" className="py-16 bg-gray">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Our Activities </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              <div className="w-full h-40 relative">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
