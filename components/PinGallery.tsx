"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Pin = {
  id: string;
  title?: string;
  image: string;
  author?: string;
};

const seedPins: Pin[] = [
  {
    id: "1",
    title: "Crisp Forest",
    image: "https://picsum.photos/id/1018/1200/800",
  },
  {
    id: "2",
    title: "Cozy Workspace",
    image: "https://picsum.photos/id/1015/1200/800",
  },
  {
    id: "3",
    title: "Modern Architecture",
    image: "https://picsum.photos/id/1016/1200/800",
  },
  {
    id: "4",
    title: "Minimal Desk",
    image: "https://picsum.photos/id/1025/1200/800",
  },
  {
    id: "5",
    title: "Sunset Hills",
    image: "https://picsum.photos/id/1003/1200/800",
  },
  {
    id: "6",
    title: "Flatlay Ideas",
    image: "https://picsum.photos/id/1062/1200/800",
  },
  {
    id: "7",
    title: "Mountain View",
    image: "https://picsum.photos/id/1011/1200/800",
  },
  {
    id: "8",
    title: "Street Art",
    image: "https://picsum.photos/id/1012/1200/800",
  },
  {
    id: "9",
    title: "Calm Lake",
    image: "https://picsum.photos/id/1019/1200/800",
  },
  {
    id: "10",
    title: "Desert Vibes",
    image: "https://picsum.photos/id/1002/1200/800",
  },
  {
    id: "11",
    title: "Desert Vibes",
    image: "https://picsum.photos/id/1002/1200/800",
  },
  {
    id: "12",
    title: "Desert Vibes",
    image: "https://picsum.photos/id/1002/1200/800",
  },
];

// Utility to simulate fetching a page of pins (replace with real API)
function fakeFetchPins(
  page: number,
  perPage = 6,
  latency = 700
): Promise<Pin[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // create next page by rotating seedPins with unique ids
      const result: Pin[] = Array.from({ length: perPage }).map((_, idx) => {
        const base = seedPins[(page * perPage + idx) % seedPins.length];
        return {
          id: `${page}-${idx}-${base.id}`,
          title: base.title,
          image: base.image,
          author: `Community`,
        };
      });
      resolve(result);
    }, latency);
  });
}

export default function PinGallery() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true); // toggle to false if backend returns no more
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsFetching(true);
      const first = await fakeFetchPins(0, 8, 600);
      if (!mounted) return;
      setPins(first);
      setPage(1);
      setIsFetching(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);
    const next = await fakeFetchPins(page, 6, 800);
    // optional: stop after N pages in demo
    if (next.length === 0 || page > 12) {
      setHasMore(false);
    }
    setPins((p) => [...p, ...next]);
    setPage((s) => s + 1);
    setIsFetching(false);
  }, [isFetching, page, hasMore]);

  // IntersectionObserver to trigger loadMore when sentinel is visible
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMore();
          }
        });
      },
      {
        root: null,
        rootMargin: "300px", // preload earlier
        threshold: 0.1,
      }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Discover</h2>
        <div className="text-sm text-gray-500">
          Infinite scroll • Animated with framer-motion
        </div>
      </div>

      <div className="masonry">
        <AnimatePresence>
          {pins.map((pin) => (
            <motion.article
              layout
              key={pin.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="pin-card mb-4 break-inside-avoid"
            >
              <PinCard pin={pin} />
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* sentinel */}
      <div ref={sentinelRef} />

      {/* loading placeholders */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isFetching &&
            Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-lg overflow-hidden bg-white/60 p-0"
              >
                <SkeletonPin />
              </motion.div>
            ))}
        </div>
      </div>

      {/* optional: message when no more */}
      {!hasMore && (
        <div className="text-center text-sm text-gray-500 mt-6">
          No more pins
        </div>
      )}
    </div>
  );
}

/* Pin card with next/image and fallback handling */
function PinCard({ pin }: { pin: Pin }) {
  const [src, setSrc] = useState(pin.image);
  return (
    <motion.div
      layout
      className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
      whileHover={{ y: -4 }}
    >
      <div className="w-full">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 0,
            paddingBottom: "66%",
          }}
        >
          <Image
            src={src}
            alt={pin.title || "pin image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            onError={() => setSrc("/placeholder.jpg")}
            priority={false}
          />
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {pin.title}
          </div>
          <button
            aria-label="save"
            className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold shadow"
          >
            Save
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          by {pin.author ?? "Unknown"}
        </div>
      </div>
    </motion.div>
  );
}

/* animated skeleton for loading state */
function SkeletonPin() {
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-sm animate-pulse">
      <div
        style={{
          width: "100%",
          height: 0,
          paddingBottom: "66%",
          background: "#eee",
        }}
      />
      <div className="p-3">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}
