"use client";

import { Suspense } from "react";
import VerifyEmailPageContent from "./VerifyEmailPageContent";
import B2CPageLayout from "../B2CPageLayout";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <B2CPageLayout>
      <VerifyEmailPageContent />
      </B2CPageLayout>
    </Suspense>
  );
}
