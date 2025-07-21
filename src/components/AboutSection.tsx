'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function AboutSection() {
  const [showMore, setShowMore] = useState(false);

  const toggleText = () => setShowMore((prev) => !prev);

  return (
    <section className="bg-white py-12 px-4 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* 📸 Image */}
        <div className="md:w-1/2 w-full px-4 md:px-8 my-6">
          <Image
            src="/images/boys.jpg"
            alt="About Amboseli Secondary School"
            width={400}
            height={250}
            className="rounded-xl shadow-lg object-cover max-w-full h-auto mx-auto"
          />
        </div>

        {/* 📖 Texte */}
        <div className="md:w-1/2 w-full text-gray-700">
          <h2 className="text-4xl font-extrabold text-green-700 mb-6">About Us</h2>

          <div className="bg-green-50 text-gray-800 text-[15px] leading-snug p-5 rounded-lg shadow-sm font-[Inter,sans-serif] space-y-4 transition-all duration-500 ease-in-out">
            <p>
              The nearest secondary school to Amboseli is 12 miles away – a distance too far for many students.
              To provide better access to continued education, Grand Circle Foundation built a secondary school
              for Amboseli in 2016.
            </p>

            {showMore && (
              <>
                <p>
                  Harriet generously offered to match all donations up to $30,000, which helped reach the
                  initial construction cost of $60,000. The school began with four essential rooms:
                  an office, a classroom, a dormitory, and a multi-use room.
                </p>
                <p>
                  Toilets were constructed for both teachers and students, and access to clean water was secured.
                  Books, desks, and teacher supplies were delivered. The school officially opened on January 15, 2018,
                  with 16 students, later growing to 23.
                </p>
                <p>
                  In 2019, enrollment was projected to grow to 50 students, with 35–40 new students joining Form 1
                  and 23 continuing to Form 2.
                </p>
                <p>
                  In just six months, the school environment improved significantly. Students now proudly wear uniforms,
                  and classrooms are equipped with solar electricity, offering a brighter and more comfortable
                  learning environment.
                </p>
                <p>
                  A new girls' dormitory was recently completed — a game-changer for girls in the Amboseli region.
                  It enables them to stay on-site, avoiding the dangerous 5–8 km daily walk through wildlife zones
                  or the need to attend distant schools over 20 kilometers away.
                </p>
                <p>
                  The school proudly welcomed its first intake of female boarders, helping ensure continued education
                  for young girls in the community.
                </p>
              </>
            )}

            <div className="pt-2">
              <button
                onClick={toggleText}
                aria-expanded={showMore}
                className="text-sm text-green-800 underline hover:text-green-600 transition-colors duration-200 focus:outline-none"
              >
                {showMore ? 'Read less' : 'Read more'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
