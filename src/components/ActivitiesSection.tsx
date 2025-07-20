"use client";

import Image from "next/image";

export default function ActivitiesSection() {
  const activities = [
    {
      title: "Books for students",
      description:
        " Amboseli Lewis Secondary School in Kenya - students of Form 4 (our 12th grade) just received new textbooks and study guides to help them succeed at the compulsory Kenya Certificate of Secondary Education Exam.",
      image: "/images/books.jpg",
    },
    {
      title: "Sports ",
      description:
        "Our sports programs are about more than just the game. We believe in fostering teamwork, discipline and resilience in every student. Through activities like football, we build a strong sense of community",
      image: "/images/foot.jpeg",
    },
    {
      title: "All girls to school",
      description:
        "girls dormitory at the school is another game changing opportunity for the girls of the Amboseli region.",
      image: "/images/lewisg.jpg",
    },
    {
      title: "Together for better",
      description:
        "Lewis Amboseli Secondary School, we donated 75 books to the library and provided 94 girls with reusable sanitary pad kits and essential menstrual education. Namelok Secondary School received around 100",
      image: "/images/ambof.jpg",
    },
  ];

  return (
    <section id="activites" className="py-16 mb-0 top-0 bg-gray-800">
      <div className="max-w-7xl mx-auto ">
        <h2 className="text-4xl font-extrabold text-white text-center mb-12">
          Our Activities
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
