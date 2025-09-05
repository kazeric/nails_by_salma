"use client";

import React, { JSX, useState, useEffect } from "react";

// Types for Strapi data
interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
}

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  image: StrapiImage;
}

interface SiteContent {
  id: number,
  businessName: string,
  tagline: string,
  introTitle: string,
  introDescription: string,
  additionalInfo: string,
  instagramHandle: string,
  tiktokHandle: string,
  phoneNumber: string,
  whatsappNumber: string,
  profileImage: StrapiImage;

}

interface PolicyItem {
  id: number;
  title: string;
  description: string;
  iconType: string;
  
}

export default function Home(): JSX.Element {
  // State for dynamic content
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Strapi API base URL - adjust this to your Strapi instance
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch site content
        const contentResponse = await fetch(
          `${STRAPI_URL}/api/site-content?populate=profileImage`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
          }
        );
        const contentData = await contentResponse.json();
        

        // Fetch gallery images
        const galleryResponse = await fetch(
          `${STRAPI_URL}/api/gallery-images?populate=image`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
          }
        );
        const galleryData = await galleryResponse.json();

        // Fetch booking policies
        const policiesResponse = await fetch(
          `${STRAPI_URL}/api/booking-policies`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
          }
        );
        const policiesData = await policiesResponse.json();

        // Set state with fetched data
        if (contentData.data) setSiteContent(contentData.data);
        if (galleryData.data) setGalleryImages(galleryData.data);
        if (policiesData.data) setPolicies(policiesData.data);

        

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data from Strapi:", err);
        setError("Failed to load content. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [STRAPI_URL]);

  // Helper function to get full image URL
  const getImageUrl = (image: StrapiImage | undefined) => {
    if (!image?.url) return "";
    const url = image.url;
    return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
  };

  // Helper function to render policy icons
  const renderPolicyIcon = (iconType: string) => {
    const iconMap: Record<string, JSX.Element> = {
      payment: (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
      ),
      cancellation: (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9L12 14.5 8.5 11 10 9.5l2 2 4-4L17.5 9z" />
      ),
      time: (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      ),
      safety: (
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
      ),
    };

    return iconMap[iconType] || iconMap.safety;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-pink-600 text-white px-6 py-2 rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
      {/* Header */}
      <header className="text-center pt-16 pb-8 px-6">
        <h1
          className="text-6xl md:text-7xl font-bold text-pink-600 mb-8"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          {siteContent?.businessName || "Nails by Salma"}
        </h1>

        {/* Social Media Links */}
        <div className="flex justify-center items-center gap-8 mb-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-pink-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <a
              className="text-slate-600 text-lg"
              target="_blank"
              rel="noreferrer"
              href={`https://instagram.com/${
                siteContent?.instagramHandle || ""
              }`}
            >
              {siteContent?.instagramHandle || "Nailsbysalma"}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-pink-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04 0z" />
            </svg>
            <a
              className="text-slate-600 text-lg"
              href={`https://tiktok.com/@${
                siteContent?.tiktokHandle || ""
              }`}
              target="_blank"
              rel="noreferrer"
            >
              {siteContent?.tiktokHandle || "Nailsbysalma"}
            </a>
          </div>
        </div>

        <p className="text-slate-500 text-lg">
          {siteContent?.tagline ||
            "Licensed Private NailTech Location Algonquin IL"}
        </p>
      </header>

      {/* Meet Your Nail Tech Section */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-6 justify-center">
            <h2
              className="text-4xl font-bold text-slate-700"
              style={{ fontFamily: "serif" }}
            >
              MEET YOUR
            </h2>
            <span
              className="text-4xl font-script text-pink-600"
              style={{ fontFamily: "Dancing Script, cursive" }}
            >
              Nail Tech
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center overflow-hidden shadow-lg">
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center border-2 border-pink-300 overflow-hidden">
                  {siteContent?.profileImage ? (
                    <img
                      src={getImageUrl(siteContent.profileImage)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-pink-600 text-xl font-semibold">
                      Salma
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="text-slate-700 text-lg leading-relaxed mb-4">
                {siteContent?.introDescription ||
                  "Hi I'm Salma! I am a private home based Licensed nail tech located in Algonquin IL. Doing nails is my passion and my goal is to make every person who sits in my chair feel beautiful and confident with their nails!"}
              </p>

              <p className="text-slate-600 text-sm">
                {siteContent?.additionalInfo ||
                  "I provide a clean comfortable space with sanitized items for every client, large variety of colors and nail charms as well as high quality products."}
              </p>
            </div>
          </div>

          <div className="flex flex-col p-8 sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${
                siteContent?.phoneNumber || "+254794548718"
              }`}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Call Now
            </a>
            <a
              href={`https://wa.me/${
                siteContent?.whatsappNumber || "254794548718"
              }`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              WhatsApp
            </a>
            <a
              href={`https://instagram.com/${
                siteContent?.instagramHandle || ""
              }`}
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Instagram DM
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="mb-16 items-center justify-center align-middle flex flex-col">
          <div className="text-center mb-8">
            <div className="flex items-center gap-4 justify-center">
              <h2
                className="text-4xl font-bold text-slate-700"
                style={{ fontFamily: "serif" }}
              >
                MY
              </h2>
              <span
                className="text-4xl font-script text-pink-600"
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                Work
              </span>
            </div>
            <p className="text-slate-600 mt-4">
              Swipe to see my latest nail designs
            </p>
          </div>

          <div className="w-[80vw] overflow-x-auto scrollbar-hide">
            <div
              className="flex gap-4 px-6 pb-4"
              style={{ width: "max-content" }}
            >
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="flex-shrink-0 w-64 h-80 rounded-2xl shadow-lg border-2 border-pink-200 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-full h-full relative">
                    <img
                      src={getImageUrl(image.image)}
                      alt={
                        image.image.alternativeText || image.title
                      }
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="font-semibold text-white mb-1">
                        {image.title}
                      </h3>
                      <p className="text-sm text-gray-200">
                        {image.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              Follow me on Instagram @
              {siteContent?.instagramHandle || "nailsbysalma"} for
              more designs
            </p>
          </div>
        </section>
      )}

      {/* Booking Policies Section */}
      {policies.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 mb-16">
          <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-8 justify-center">
              <h2
                className="text-4xl font-bold text-slate-700"
                style={{ fontFamily: "serif" }}
              >
                BOOKING
              </h2>
              <span
                className="text-4xl font-script text-pink-600"
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                Policies
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {policies.map((policy) => (
                <div key={policy.id} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-pink-50 rounded-full flex items-center justify-center border-2 border-pink-200">
                    <svg
                      className="w-10 h-10 text-pink-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {renderPolicyIcon(policy.iconType)}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                    {policy.title}
                  </h3>
                  <div className="text-sm text-slate-600">
                    <p>{policy.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-3xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-slate-700 mb-6">
            Ready to Book?
          </h3>
          <p className="text-slate-600 mb-6">
            Contact me directly to schedule your appointment
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${
                siteContent?.phoneNumber || "+254794548718"
              }`}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Call Now
            </a>
            <a
              href={`https://wa.me/${
                siteContent?.whatsappNumber || "254794548718"
              }`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              WhatsApp
            </a>
            <a
              href={`https://instagram.com/${
                siteContent?.instagramHandle || ""
              }`}
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Instagram DM
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap");

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
