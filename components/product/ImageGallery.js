"use client";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import BookingCard from "./BookingCard";

export default function ImageGallery({
  product,
  currentImageIndex,
  setCurrentImageIndex,
  nextImage,
  prevImage,
  currentImage,
  price,
}) {
  const [showModal, setShowModal] = useState(false);

  // Dummy placeholders (used by index if original image missing)
  const placeholderImages = [
    "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=800",
    "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800",
    "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=800",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
    "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  ];

  // Use product images, fallback to dummy placeholders (indexed)
  const images =
    product?.tourImages?.length > 0
      ? product.tourImages.map((img, i) => ({
          // imagePath: img?.imagePath || placeholderImages[i % placeholderImages.length],
          imagePath: placeholderImages[i % placeholderImages.length],
        }))
      : placeholderImages.map((url) => ({ imagePath: url }));

  const videoUrl = product?.videoUrl;
  const embedUrl = videoUrl.replace("youtu.be/", "www.youtube.com/embed/");

  return (
    <div className="mb-10">
      {/* ---------- TOP INFO SECTION ---------- */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-gray-500 uppercase">
            {product?.category || product?.cityTourType || "Adventure"}
          </div>
          <div className="flex items-center gap-2 text-sm text-yellow-600 font-semibold">
            <span>⭐ {product?.rating || "0"}</span>
            <span>({product?.reviewCount || "0"})</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            {product?.tourName ||
              "Skydive Dubai at The Palm with Photos & Video"}
          </h1>

          <div className=" block lg:hidden lg:col-span-4">
            <BookingCard price={price} />
          </div>
        </div>
      </div>

      {/* ---------- GALLERY SECTION ---------- */}
      <div className="grid md:grid-cols-3 gap-3">
        {/* LEFT SIDE - VIDEO OR MAIN IMAGE */}
        <div className="relative col-span-2 h-[450px] rounded-2xl overflow-hidden shadow-lg group">
          {videoUrl ? (
            <iframe
              src={embedUrl}
              title="Tour Video"
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <Image
              src={images[0]?.imagePath}
              alt={product?.tourName}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* RIGHT SIDE - FIRST 4 IMAGES */}
        <div className="relative sm:h-[450px] md:grid md:grid-cols-2 md:grid-rows-2 md:gap-2 flex gap-2 overflow-x-auto md:overflow-x-visible">
          {images.slice(0, 4).map((img, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden cursor-pointer flex-shrink-0 w-[180px] md:w-full h-[180px] md:h-full"
              onClick={() => setShowModal(true)}
            >
              <Image
                src={img.imagePath}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}

          {/* View All Button */}
          {images.length > 4 && (
            <button
              onClick={() => setShowModal(true)}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-sm font-semibold text-gray-800 px-3 py-1 rounded-md shadow-md"
            >
              View all images
            </button>
          )}
        </div>
      </div>

      {/* ---------- IMAGE MODAL ---------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center px-6 py-10">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-5 right-5 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-6xl w-full overflow-y-auto space-y-6 scrollbar-hide">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative w-full h-[450px] rounded-xl overflow-hidden"
              >
                <Image
                  src={img.imagePath}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
