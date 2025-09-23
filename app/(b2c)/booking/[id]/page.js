"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  Share2,
  ArrowLeft,
  Shield,
  CreditCard,
  Phone,
  Sparkles,
} from "lucide-react";
import { productsApi } from "@/lib/api";
import Loader from "@/components/common/Loader";
import B2CPageLayout from "../../B2CPageLayout";
import ProductInfo from "@/components/product/ProductInfo";
import ImageGallery from "@/components/product/ImageGallery";
import Tabs from "@/components/product/Tabs";
import BookingCard from "@/components/product/BookingCard";

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const contractId = searchParams.get("contractId");
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        const productData = await productsApi.getProductById(
          params.id,
          contractId
        );
        setProduct(productData.result.result[0]);
        setPrice(productData.result.price || 0);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, contractId]);

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.tourName,
          text: product.tourDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Sharing cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % (product.tourImages?.length || 1)
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.tourImages?.length - 1 || 0 : prev - 1
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentImage =
    product.tourImages?.[currentImageIndex]?.imagePath || product.imagePath;

  return (
    <B2CPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-[80px] w-full z-30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={shareProduct}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? "text-red-500 fill-current" : "text-gray-600"
                    }`}
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="pt-16"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Product Header */}
          {/* Image Gallery */}

          <ImageGallery
            product={product}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            nextImage={nextImage}
            prevImage={prevImage}
            currentImage={currentImage}
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side - 8 cols */}
            <div className="lg:col-span-8">
              <ProductInfo
                product={product}
                price={price}
                renderStars={renderStars}
              />

              <Tabs product={product} renderStars={renderStars} />
            </div>

            {/* Right Side - 4 cols */}
            <div className="lg:col-span-4">
              <BookingCard price={price} />
            </div>
          </div>

          {/* Trust & Safety Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Shield,
                title: "Safety First",
                desc: "COVID-19 safety measures",
                color: "text-green-500",
              },
              {
                icon: CreditCard,
                title: "Secure Booking",
                desc: "SSL encrypted payments",
                color: "text-blue-500",
              },
              {
                icon: Phone,
                title: "24/7 Support",
                desc: "Always here to help",
                color: "text-purple-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-white/20 text-center hover:shadow-xl transition-shadow"
              >
                <item.icon className={`w-12 h-12 ${item.color} mx-auto mb-4`} />
                <h4 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </B2CPageLayout>
  );
}
