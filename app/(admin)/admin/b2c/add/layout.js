import { Suspense } from 'react';
import Loader from '@/components/common/Loader';

export default function AddB2BUserLayout({ children }) {
  return (
    <Suspense fallback={<Loader />}>
      {children}
    </Suspense>
  );
}