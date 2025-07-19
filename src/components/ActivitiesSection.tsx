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
      title: 'Sports ',
      description: 'Développer la créativité à travers l’art visuel.',
      image: '/images/foot.jpeg',
    },
    {
      title: 'All grils to school',
      description: 'girls dormitory at the school is another game changing opportunity for the girls of the Amboseli region.',
      image: '/images/lewisg.jpg',
    },
    {
      title: 'Activités Sportives',
      description: 'Favoriser l’esprit d’équipe et le bien-être physique.',
      image: '/images/kilm.jpg',
    },
  ];

  return (
    <section id="activites" className="py-16 mb-0 top-0 bg-gray-800">
      <div className="max-w-7xl mx-auto ">
        <h2 className="text-4xl font-extrabold text-white text-center mb-12">
          Our Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-105"
            >
              <div className="w-full h-44 relative">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
