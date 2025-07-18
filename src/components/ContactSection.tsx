'use client';

import { Mail, Facebook, Phone } from 'lucide-react';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Mr. John Doe',
    role: 'Directeur',
    imageUrl: '/team/director.jpg', // Remplace par le bon chemin de l’image
  },
  {
    name: 'Mrs. Jane Smith',
    role: 'Deputy Principal',
    imageUrl: '/team/deputy.jpg',
  },
  {
    name: 'Mr. Michael Mwangi',
    role: 'Head Teacher',
    imageUrl: '/team/headteacher.jpg',
  },
  {
    name: 'Ms. Aisha Mutua',
    role: 'Administrator',
    imageUrl: '/team/admin.jpg',
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="bg-#b62121 py-16">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Team & Contact</h2>

        {/* Team Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                src={member.imageUrl}
                alt={member.name}
                width={120}
                height={120}
                className="rounded-full object-cover shadow-lg"
              />
              <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="space-y-6 text-gray-700 text-lg">

          <div className="flex items-center justify-center space-x-4">
            <Phone className="text-green-500 w-6 h-6" />
            <span>+243 900 000 000</span>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Mail className="text-blue-500 w-6 h-6" />
            <span>contact@exemple.com</span>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Facebook className="text-blue-700 w-6 h-6" />
            <a
              href="https://facebook.com/votrepage"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              facebook.com/votrepage
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
