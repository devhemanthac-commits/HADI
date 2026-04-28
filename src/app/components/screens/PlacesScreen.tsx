import { useState, useEffect } from "react";
import { useColors } from "../../context/AppContext";
import { allPlaces, categories, placesByCategory, type PlaceCategory, type Place } from "../../data/places";
import { ImageWithFallback } from "../figma/ImageWithFallback";

function ImageCarousel({ place }: { place: Place }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = place.images || [place.image];

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative" style={{ height: 200, overflow: "hidden" }}>
      {/* Images container */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="h-full w-full shrink-0">
            <ImageWithFallback
              src={img}
              alt={`${place.name} - ${idx + 1}`}
              className="w-full h-full object-cover"
              style={{ height: 200 }}
            />
          </div>
        ))}
      </div>

      {/* Image indicators */}
      {images.length > 1 && (
        <div
          className="absolute bottom-3 left-1/2 flex gap-1.5"
          style={{ transform: "translateX(-50%)" }}
        >
          {images.map((_, idx) => (
            <div
              key={idx}
              className="transition-all duration-300"
              style={{
                width: currentIndex === idx ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background: currentIndex === idx ? "#E07B2A" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PlacesScreen() {
  const C = useColors();
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | "All">("All");

  const displayPlaces = selectedCategory === "All"
    ? allPlaces
    : placesByCategory(selectedCategory);

  return (
    <div className="animate-fade-up flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 pb-4" style={{ background: C.bg }}>
        <h1 className="font-playfair mb-2" style={{ color: C.text, fontSize: 28, fontWeight: 700 }}>
          Explore Mysuru
        </h1>
        <p className="font-dm mb-4" style={{ color: C.muted, fontSize: 14, lineHeight: 1.5 }}>
          Discover the hidden and famous places that make Mysuru magical
        </p>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setSelectedCategory("All")}
            className="font-dm whitespace-nowrap shrink-0 pressable"
            style={{
              padding: "8px 16px",
              borderRadius: 99,
              background: selectedCategory === "All" ? "#E07B2A" : "transparent",
              border: selectedCategory === "All" ? "none" : `1px solid ${C.borderStrong}`,
              color: selectedCategory === "All" ? "#fff" : C.muted,
              fontWeight: selectedCategory === "All" ? 600 : 400,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            All Places
          </button>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="font-dm whitespace-nowrap shrink-0 pressable"
                style={{
                  padding: "8px 16px",
                  borderRadius: 99,
                  background: active ? "#E07B2A" : "transparent",
                  border: active ? "none" : `1px solid ${C.borderStrong}`,
                  color: active ? "#fff" : C.muted,
                  fontWeight: active ? 600 : 400,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Places grid */}
      <div className="grid grid-cols-1 gap-4">
        {displayPlaces.map((place) => (
          <div
            key={place.id}
            className="rounded-[20px] overflow-hidden cursor-pointer pressable"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              boxShadow: "0 2px 12px rgba(26,18,8,0.06)",
            }}
          >
            {/* Image / Carousel */}
            <div className="relative">
              <ImageCarousel place={place} />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)",
                }}
              />
              {/* Emoji badge */}
              <div
                className="absolute top-3 left-3 flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: place.gradient,
                  fontSize: 24,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {place.emoji}
              </div>
              {/* Category badge */}
              <div
                className="absolute top-3 right-3 font-dm"
                style={{
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 99,
                }}
              >
                {place.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3
                className="font-playfair mb-1"
                style={{ color: C.text, fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}
              >
                {place.name}
              </h3>
              <div className="flex items-center gap-1.5 mb-2">
                <span style={{ fontSize: 12, color: C.muted }}>📍</span>
                <p className="font-dm" style={{ color: C.muted, fontSize: 12 }}>
                  {place.location}
                </p>
              </div>
              {place.description && (
                <p
                  className="font-dm"
                  style={{
                    color: C.textSecondary,
                    fontSize: 13,
                    lineHeight: 1.5,
                    marginTop: 8,
                  }}
                >
                  {place.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {displayPlaces.length === 0 && (
        <div className="text-center py-12">
          <p className="font-dm" style={{ color: C.muted, fontSize: 14 }}>
            No places found in this category
          </p>
        </div>
      )}
    </div>
  );
}
