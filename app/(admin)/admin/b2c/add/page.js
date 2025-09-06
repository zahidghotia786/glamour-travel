import { Suspense } from 'react';
import Loader from '@/components/common/Loader';
import AddB2BUserContent from './AddB2BUserContent';

export default function AddB2BUserPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AddB2BUserContent />
    </Suspense>
  );
}