export function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-gray-100 rounded-xl animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function SkeletonPantryCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20 rounded-lg" />
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
      <div className="flex gap-2 pt-1 border-t border-gray-50">
        <Skeleton className="h-8 flex-1 rounded-xl" />
        <Skeleton className="h-8 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonRecipeCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-24 rounded-lg" />
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
      </div>
      <div className="p-5 pt-0 flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonFavoriteCard() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="pt-4 border-t border-gray-50 flex gap-2">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonSavingsCard() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <Skeleton className="h-12 w-36" />
      <Skeleton className="h-3 w-24" />
      <div className="pt-2 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonSavingsRow() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="text-right space-y-1.5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
