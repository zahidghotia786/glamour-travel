"use client";
import AddB2BUserPage from "@/components/pages/AddB2BUserPage";
import { Suspense } from "react";

export default function AddB2BUserPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading user form...</div>}>
      <AddB2BUserPage />
    </Suspense>
  );
}
