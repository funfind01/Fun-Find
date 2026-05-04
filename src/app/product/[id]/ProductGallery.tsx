"use client";

import { useState } from "react";

export default function ProductGallery({ images, productName }: { images: string[], productName: string }) {
  const [mainImage, setMainImage] = useState(images[0] || "");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter out any invalid/empty images
  const validImages = images.filter(Boolean);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div 
          className="aspect-square max-h-[56vh] lg:max-h-[58vh] bg-[#f3f3f4] rounded-lg overflow-hidden group cursor-pointer relative"
          onClick={() => { if(mainImage) setIsPreviewOpen(true); }}
        >
          {mainImage ? (
            <img
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              src={mainImage}
              alt={productName}
            />
          ) : (
            <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">No Image</div>
          )}
          {mainImage && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 drop-shadow-md text-4xl transition-opacity">zoom_in</span>
            </div>
          )}
        </div>

        {/* Thumbnails (only show if there's more than 1 image) */}
        {validImages.length > 1 && (
          <div className="grid grid-cols-4 gap-4 max-h-[13vh]">
            {validImages.map((img, i) => (
              <div
                key={img + i}
                onClick={() => setMainImage(img)}
                className={`aspect-square max-h-[13vh] bg-[#f3f3f4] rounded-lg overflow-hidden cursor-pointer ${mainImage === img ? "border-2 border-black" : "opacity-70 hover:opacity-100"}`}
              >
                <img className="w-full h-full object-contain" src={img} alt={`Thumbnail ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-sm"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(false); }}
          >
            <span className="material-symbols-outlined block">close</span>
          </button>
          <img 
            src={mainImage} 
            alt={productName} 
            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
}
