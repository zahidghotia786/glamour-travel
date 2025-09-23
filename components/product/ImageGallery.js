"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({
  product,
  currentImageIndex,
  setCurrentImageIndex,
  nextImage,
  prevImage,
  currentImage,
}) {
  // Total images
  const total = product.tourImages?.length || 0;

  // Grid columns logic (desktop view)
  let gridCols = "grid-cols-2";
  if (total <= 5) {
    gridCols = "grid-cols-2";
  } else if (total <= 10) {
    gridCols = "grid-cols-3";
  } else {
    gridCols = "grid-cols-4";
  }

  return (
    <div className="mb-10">
      {/* Grid for larger screens */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {/* Left Large Image */}
        <div className="col-span-2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
          <Image
            src={currentImage}
            alt={product.tourName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {total > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentImageIndex + 1} / {total}
            </div>
          )}
        </div>

        {/* Right Side Thumbnails in Grid */}
        <div
          className={`grid ${gridCols} gap-3 max-h-[500px] overflow-y-auto pr-2`}
        >
          {product.tourImages?.map((image, index) =>
            index === currentImageIndex ? null : (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-28 w-full rounded-xl overflow-hidden transition-all ${
                  index === currentImageIndex
                    ? "ring-2 ring-blue-500 ring-offset-2 transform scale-105"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.imagePath}
                  alt={`${product.tourName} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            )
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {/* Large Image on top */}
        <div className="relative h-72 rounded-2xl overflow-hidden shadow-xl group">
          <Image
            src={currentImage}
            alt={product.tourName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails Scroll Slider */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {product.tourImages?.map((image, index) =>
            index === currentImageIndex ? null : (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 h-20 w-28 rounded-lg overflow-hidden transition-all ${
                  index === currentImageIndex
                    ? "ring-2 ring-blue-500 transform scale-105"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.imagePath}
                  alt={`${product.tourName} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
