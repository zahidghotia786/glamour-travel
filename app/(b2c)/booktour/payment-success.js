import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { checkPaymentStatus } from '@/lib/bookingService';

const PaymentSuccess = () => {
  const router = useRouter();
  const { bookingId, paymentIntentId } = router.query;
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!bookingId || !paymentIntentId) {
        setStatus('error');
        setMessage('Missing payment information');
        return;
      }

      try {
        setStatus('processing');
        setMessage('Confirming your payment...');

        // Check payment status with backend
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            bookingId,
            paymentIntentId
          }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus('success');
          setMessage('Payment confirmed successfully!');
          
          // Redirect to bookings page after 3 seconds
          setTimeout(() => {
            router.push('/profile/my-bookings');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Payment confirmation failed');
        }

      } catch (error) {
        console.error('Payment confirmation error:', error);
        setStatus('error');
        setMessage('Failed to confirm payment. Please check your bookings page.');
      }
    };

    confirmPayment();
  }, [bookingId, paymentIntentId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to bookings page...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Issue</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/my-bookings')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              View My Bookings
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;