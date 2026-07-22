'use client';

import { useState } from 'react';

interface ProductGalleryProps {
  mainImage: string;
  galleryUrls?: string[];
}

export default function ProductGallery({ mainImage, galleryUrls = [] }: ProductGalleryProps) {
  const defaultImage =
    mainImage ||
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000';

  // Filter and deduplicate images
  const allImages = Array.from(
    new Set([defaultImage, ...(galleryUrls || []).filter(Boolean)])
  );

  const [activeImage, setActiveImage] = useState<string>(allImages[0] || defaultImage);

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl bg-stone-100 border border-stone-200/80 shadow-md group">
        <img
          src={activeImage}
          alt="Product detail main image"
          className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {allImages.map((imgUrl, index) => {
            const isActive = activeImage === imgUrl;
            return (
              <button
                key={index}
                onClick={() => setActiveImage(imgUrl)}
                className={`relative w-20 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-[#1C1B1A] ring-2 ring-[#C5A059]/50 shadow-md scale-105'
                    : 'border-stone-200/80 opacity-70 hover:opacity-100 hover:border-stone-400'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
