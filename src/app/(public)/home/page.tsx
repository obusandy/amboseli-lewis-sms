"use client";

import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import ContactSection from "@/components/ContactSection";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Link from "next/link";
import ScrollToHash from "@/components/ScrollToHash";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";

export default function RealHomePage() {
  return (
    <main className="relative min-h-screen w-full">
      <ScrollToHash />
      <Navbar />

      {/* Hero Carousel */}
      <section className="relative h-screen w-full">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={5000}
          transitionTime={1000}
          className="h-screen"
        >
          {["evele.jpeg", "groupe.jpeg", "ndovu.jpeg", "examen.jpeg"].map(
            (img, index) => (
              <div key={index} className="relative w-full h-screen">
                <Image
                  src={`/images/${img}`}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover brightness-75"
                  priority
                />
              </div>
            )
          )}
        </Carousel>

        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white px-4 text-center bg-black/30">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Amboseli Lewis Secondary School
          </h1>
          <p className="text-lg md:text-2xl mb-6 max-w-2xl drop-shadow-md">
            &quot; ENTER TO LEARN,LEAVE TO ACHIEVE&quot;
          </p>

          <Link
            href="/mission"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg shadow-md"
          >
            Our mission
          </Link>
        </div>
      </section>
      <ScrollToTopButton />

      <section id="about" className="py-16 bg-white">
        <AboutSection />
      </section>
      <section id="activities" className="py-16 bg-gray-50">
        <ActivitiesSection />
      </section>

      <section id="contact" className="py-16 bg-white">
        <ContactSection />
      </section>
    </main>
  );
}
