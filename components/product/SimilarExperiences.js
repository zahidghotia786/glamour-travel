'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { fetchFromAPI } from '@/lib/api'

export default function SimilarExperiences() {
  const [topRated, setTopRated] = useState([])
  const [topThings, setTopThings] = useState([])
  const [visibleTopRated, setVisibleTopRated] = useState(6)
  const [visibleTopThings, setVisibleTopThings] = useState(6)
  const router = useRouter()

  const placeholderImages = [
    "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=800",
    "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800",
    "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=800",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
    "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  ]
  const getPlaceholder = (i) => placeholderImages[i % placeholderImages.length]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFromAPI('Tour/dubai/tours/public')
        if (data?.result?.length) {
          const tours = data.result

          const top = [...tours]
            .filter(t => t.rating > 0)
            .sort((a, b) => {
              const scoreA = a.rating * 100 + a.reviewCount
              const scoreB = b.rating * 100 + b.reviewCount
              return scoreB - scoreA
            })
          setTopRated(top)

          const topThings = [...tours]
          setTopThings(topThings)
        }
      } catch (error) {
        console.error('Error fetching similar experiences:', error)
      }
    }
    fetchData()
  }, [])

  const handleClick = (tourId, contractId) => {
    router.push(`/booking/${tourId}?contractId=${contractId}`)
  }

  const Section = ({ title, items, visibleCount, onSeeMore }) => {
    const visibleItems = items.slice(0, visibleCount)
    const hasMore = visibleCount < items.length

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 scroll-mt-24"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">{title}</h3>
        </div>

        {/* Responsive grid: scrollable horizontally on mobile, 3 per row on desktop */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar 
                        sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible pb-2">
          {visibleItems.map((item, i) => (
            <motion.div
              key={`${item.tourId}-${i}`}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => handleClick(item.tourId, item.contractId)}
              className="bg-white min-w-[250px] sm:min-w-0 snap-start rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200"
            >
              {/* Image */}
              <div className="relative">
                <Image
                  src={item.imageUrl || getPlaceholder(i)}
                  alt={item.tourName}
                  width={400}
                  height={300}
                  className="w-full h-40 object-cover"
                />
                {item.recommended && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    Recommended
                  </div>
                )}
                {item.rating > 0 && (
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                    {item.rating} ★
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                  {item.tourName}
                </h4>

                <div className="flex items-center text-gray-500 text-xs mb-2">
                  <MapPin size={12} className="mr-1" />
                  {item.cityName}, {item.countryName}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    {item.duration || 'Flexible'}
                  </div>
                  <span className="text-gray-500">
                    {item.reviewCount || 0} reviews
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-blue-600">
                    AED {item.price || '120'}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClick(item.tourId, item.contractId)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={onSeeMore}
              className="px-5 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition"
            >
              See more
            </button>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="px-4 md:px-10 lg:px-20 py-10 bg-gray-50">
      {topRated.length > 0 && (
        <Section
          title="Similar experiences you’d love"
          items={topRated}
          visibleCount={visibleTopRated}
          onSeeMore={() => setVisibleTopRated(prev => prev + 6)}
        />
      )}
      {topThings.length > 0 && (
        <Section
          title="Top things to do in Dubai"
          items={topThings}
          visibleCount={visibleTopThings}
          onSeeMore={() => setVisibleTopThings(prev => prev + 6)}
        />
      )}
    </div>
  )
}
