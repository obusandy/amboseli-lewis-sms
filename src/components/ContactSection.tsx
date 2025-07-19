'use client';

import { Mail, Facebook, Phone } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Agnes',
    imageUrl: "/images/test2.jpg",
    testimonial: "Thanks to this school, I was able to pursue my educational dreams without having to walk miles every day.",
  },
  {
    name: 'Emmanuel',
    imageUrl: "/images/test4.jpg",
    testimonial: "The teachers are amazing and I feel supported every step of the way.",
  },
  {
    name: 'Josephine',
    imageUrl: "/images/test3.jpg",
    testimonial: "It’s more than just a school. It’s a second home for me.",
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-10 bg-gradient-to-br from-[#3A1C1C] to-[#4B1D1D] text-white py-20 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto space-y-20">

        {/* 🧑‍🏫 Word of the Principal avec photo ronde */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-gray-200">
          <Image
            src="/images/oj.jpg" // mets ici la bonne image
            alt="Principal"
            width={100}
            height={100}
            className="rounded-full object-cover shadow-lg"
          />
          <div className="text-center md:text-left">
            <p className="italic text-lg leading-relaxed max-w-2xl">
              “Education is not just about books — it’s about shaping character, building resilience,
              and empowering every child with the tools to lead a better life.”
            </p>
            <span className="block mt-3 text-sm font-semibold text-gray-400">
              — Mr. Obunga James, Head Teacher
            </span>
          </div>
        </div>

        {/* 📞 Contact Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              A World of <span className="text-green-400">Principles</span>
            </h2>
            <p className="text-gray-300 max-w-xl text-base md:text-lg leading-relaxed">
              We are driven by a commitment to excellence in leadership and education. Feel free to contact us directly.
            </p>
          </div>

          <div className="space-y-4 text-sm md:text-base">
            <div className="flex items-center gap-3">
              <Facebook className="w-5 h-5 text-blue-500" />
              <a
                href="https://facebook.com/votrepage"
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-gray-100"
              >
                facebook.com/votrepage
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-yellow-300" />
              <a href="mailto:contact@exemple.com" className="hover:underline text-gray-100">
                contact@exemple.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-400" />
              <span className="text-gray-100">+243 900 000 000</span>
            </div>
          </div>
        </div>

        {/* 👩🏽‍🎓 Témoignages des élèves sans cartes */}
        <div>
          <div className="w-full border-t border-gray-600 mb-10"></div>
          <h3 className="text-2xl font-bold text-center mb-10 text-white tracking-wide">
            Student Testimonials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center">
            {testimonials.map((student, index) => (
              <div key={index}>
                <Image
                  src={student.imageUrl}
                  alt={student.name}
                  width={100}
                  height={100}
                  className="mx-auto rounded-full object-cover shadow-md mb-4"
                />
                <h4 className="text-lg font-semibold">{student.name}</h4>
                <p className="mt-2 text-sm italic text-gray-300 max-w-xs mx-auto">"{student.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
