export default function WeatherSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">

      {/* naslov */}
      <div className="h-6 w-40 bg-gray-300 rounded" />

      {/* glavna kartica */}
      <div className="bg-gray-200 rounded-xl p-6 flex flex-col gap-4">

        <div className="h-16 w-24 bg-gray-300 rounded" />

        <div className="flex gap-2">
          <div className="h-4 w-16 bg-gray-300 rounded" />
          <div className="h-4 w-16 bg-gray-300 rounded" />
        </div>

        <div className="h-16 w-16 bg-gray-300 rounded-full" />
      </div>

      {/* hourly skeleton */}
      <div className="flex gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-3 w-10 bg-gray-300 rounded" />
            <div className="h-10 w-10 bg-gray-300 rounded" />
            <div className="h-3 w-8 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

    </div>
  );
}