// app/admin/b2b/add/page.js
export const dynamic = "force-dynamic";   // <-- add this

import { Suspense } from "react";
import AddB2BUserPage from "@/components/AddB2BUserPage";
import Loader from "@/components/common/Loader";

export default function AddB2BUserPageWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <AddB2BUserPage />
    </Suspense>
  );
}
