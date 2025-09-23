"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AvailabilityPage from "./AvailabilityPage";

function AvailabilityPageWrapper() {
  const searchParams = useSearchParams();
  
  return <AvailabilityPage searchParams={searchParams} />;
}

export default function AvailabilityWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AvailabilityPageWrapper />
    </Suspense>
  );
}