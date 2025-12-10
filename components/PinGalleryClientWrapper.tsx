"use client";

import React, { Suspense, lazy } from "react";

// React.lazy will split this into a separate client bundle and load it only on the client
const PinGallery = lazy(() => import("./PinGallery"));

export default function PinGalleryClientWrapper() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto py-6">
          <div className="h-48 rounded-lg bg-gray-100 animate-pulse" />
        </div>
      }
    >
      <PinGallery />
    </Suspense>
  );
}
