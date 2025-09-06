import Loader from '@/components/common/Loader';
import { Suspense } from 'react';

export default function AddB2BUserLayout({ children }) {
  return (
    <Suspense fallback={<Loader />}>
      {children}
    </Suspense>
  );
}