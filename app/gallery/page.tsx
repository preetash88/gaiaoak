// app/gallery/page.tsx
import Image from "next/image";

export default function Gallery() {
  const images = [
    "/file.svg",
    "/globe.svg",
    "/next.svg",
    "/vercel.svg",
    "/window.svg",
  ];

  return (
    <section className="py-12">
      <h1 className="text-3xl font-bold text-temple">Gallery</h1>
      <p className="mt-2 text-sm text-gray-600">
        Photos from seva events and cultural programs.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {images.map((src, i) => (
          <div key={i} className="overflow-hidden rounded-md border">
            <Image
              src={src}
              alt={`photo-${i}`}
              className="w-full h-40 object-cover"
              width={200}
              height={160}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
