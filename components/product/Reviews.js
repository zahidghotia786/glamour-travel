"use client";

export default function Reviews({ product }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold">Customer Reviews</h3>
      {product.reviews?.length > 0 ? (
        product.reviews.map((review, idx) => (
          <div key={idx} className="border-b pb-3">
            <p className="font-medium">{review.name}</p>
            <p className="text-gray-600 text-sm">{review.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
}
