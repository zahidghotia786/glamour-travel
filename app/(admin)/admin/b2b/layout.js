// app/admin/b2b/layout.js
import { Suspense } from 'react';
import Loader from '@/components/common/Loader';

export default function B2BLayout({ children }) {
  return (
    <Suspense fallback={<Loader />}>
      {children}
    </Suspense>
  );
}