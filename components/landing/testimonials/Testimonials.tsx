import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { TESTIMONIALS, TESTIMONIALS_2 } from "@/constants";
import { IconUser, IconStar, IconStarFilled } from "@tabler/icons-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star}>
          {star <= rating ? (
            <IconStarFilled className="h-4 w-4 text-yellow-400" />
          ) : (
            <IconStar className="h-4 w-4 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}

function Testimonials() {
  return (
    <div className="container mx-auto py-26">
      <InfiniteSlider speedOnHover={10} speed={20} gap={24} className="py-2">
        {TESTIMONIALS.map((testimonial, index) => (
          <div
            key={`${testimonial.name}-${index}`}
            className="group relative flex-shrink-0 p-1"
          >
            <div className="relative w-80 h-44 overflow-hidden rounded-lg border border-border bg-white dark:bg-neutral-800 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md p-6">
              {/* Header with user icon and name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <IconUser className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </h4>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>

              {/* Review text */}
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                &ldquo;{testimonial.review}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </InfiniteSlider>
      <InfiniteSlider speedOnHover={10} speed={20} gap={24} reverse className="py-2">
        {TESTIMONIALS_2.map((testimonial, index) => (
          <div
            key={`${testimonial.name}-${index}`}
            className="group relative flex-shrink-0 p-1"
          >
            <div className="relative w-80 h-44 overflow-hidden rounded-lg border border-border bg-white dark:bg-neutral-800 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md p-6">
              {/* Header with user icon and name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <IconUser className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </h4>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>

              {/* Review text */}
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                &ldquo;{testimonial.review}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}

export default Testimonials;
