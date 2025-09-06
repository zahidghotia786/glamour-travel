import Loader from '@/components/common/Loader';
import { Suspense } from 'react';

export default function EditB2BUserLayout({ children }) {
  return (
    <Suspense fallback={<Loader />}>
      {children}
    </Suspense>
  );
}