'use client';

import Image from 'next/image';


export default function AboutSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-8 p-6 bg-white">
      {/* 📸 Image à gauche */}
   <Image
  src="/images/about.jpeg"
  alt="À propos de l'école"
  width={300}
  height={300}
  className="rounded-lg shadow-md object-cover"
/>

      {/* 📖 Texte à droite */}
      <div className="md:w-1/2 w-full text-gray-700">
        <h2 className="text-3xl font-bold mb-4 text-green-700">About Us</h2>
        <p>
          The nearest secondary school to Amboseli is 12 miles away – a distance too far for many students.
          To provide better access to continued education, Grand Circle Foundation built a secondary school
          for Amboseli in 2016.
        </p>

        <p>
          Harriet generously offered to match all donations up to $30,000, which helped reach the
          initial construction cost of $60,000. The school began with four essential rooms:
          an office, a classroom, a dormitory, and a multi-use room.
        </p>

        <p>
          Toilets were constructed for both teachers and students, and access to clean water was secured.
          Books, desks, and school and teacher supplies were delivered.
          The school officially opened on January 15, 2018, with 16 students, later growing to 23.
        </p>

        <p>
          In 2019, enrollment was projected to grow to 50 students, with 35-40 new students joining Form 1
          and 23 continuing to Form 2.
        </p>

        <p>
          In just six months, the school environment improved significantly. Students now proudly wear uniforms,
          and classrooms are equipped with solar electricity, offering a brighter and more comfortable
          learning environment.
        </p>

        <p>
          A new girls' dormitory was recently completed — a game-changer for girls in the Amboseli region.
          It enables them to stay on-site, avoiding the dangerous 5-8 km daily walk through wildlife zones
          or the need to attend distant schools over 20 kilometers away.
        </p>

        <p>
          The school proudly welcomed its first intake of female boarders, helping to ensure the continued
          education of young girls in the community.
        </p>
      </div>
     

    
    </section>
    
  );
}
