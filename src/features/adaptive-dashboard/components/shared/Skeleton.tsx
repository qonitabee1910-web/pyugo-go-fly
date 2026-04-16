/**
 * Skeleton loading components for adaptive dashboard
 */

export const SkeletonLoader = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

export const MobileSkeletonDashboard = () => (
  <div className="pb-20">
    {/* Header Skeleton */}
    <div className="sticky top-0 z-40 bg-white border-b p-4">
      <div className="flex justify-between items-center mb-4">
        <SkeletonLoader className="h-6 w-20" />
        <div className="flex gap-3">
          <SkeletonLoader className="h-8 w-8 rounded-full" />
          <SkeletonLoader className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <SkeletonLoader className="h-4 w-32" />
    </div>

    {/* Quick Actions Skeleton */}
    <div className="px-4 py-6">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonLoader key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>

    {/* Promo Skeleton */}
    <div className="px-4 py-6">
      <SkeletonLoader className="h-32 rounded-xl" />
    </div>

    {/* Bookings Skeleton */}
    <div className="px-4 py-6">
      <SkeletonLoader className="h-5 w-32 mb-4" />
      {[1, 2, 3].map((i) => (
        <SkeletonLoader key={i} className="h-20 rounded-xl mb-3" />
      ))}
    </div>
  </div>
);

export const DesktopSkeletonDashboard = () => (
  <div>
    {/* Search Widget Skeleton */}
    <div className="max-w-7xl mx-auto px-6 py-8">
      <SkeletonLoader className="h-40 rounded-lg mb-6" />
    </div>

    {/* Promo Banner Skeleton */}
    <div className="bg-gray-50 border-t border-b">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SkeletonLoader className="h-48 rounded-lg" />
      </div>
    </div>

    {/* Services Grid Skeleton */}
    <div className="max-w-7xl mx-auto px-6 py-8">
      <SkeletonLoader className="h-6 w-32 mb-6" />
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonLoader key={i} className="h-36 rounded-lg" />
        ))}
      </div>
    </div>

    {/* Bookings Skeleton */}
    <div className="max-w-7xl mx-auto px-6 py-8">
      <SkeletonLoader className="h-6 w-32 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <SkeletonLoader key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);
