// app/(b2c)/availability/page.tsx
"use client";

import { Suspense } from "react";
import AvailabilityPage from "./AvailabilityPage";

export default function AvailabilityWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AvailabilityPage />
    </Suspense>
  );
}
