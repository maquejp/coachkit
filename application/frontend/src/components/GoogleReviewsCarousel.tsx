import { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';

interface GoogleReview {
  quote: string;
  author: string;
  avatarSrc?: string;
  initials?: string;
  rating: number;
}

interface GoogleReviewsCarouselProps {
  reviews: GoogleReview[];
  intervalMs?: number;
}

export default function GoogleReviewsCarousel({
  reviews,
  intervalMs = 4000,
}: GoogleReviewsCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [reviews.length, intervalMs]);

  if (reviews.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {reviews.map((review, i) => (
            <div key={i} className="w-full shrink-0 px-1">
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>

      {reviews.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === current ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
