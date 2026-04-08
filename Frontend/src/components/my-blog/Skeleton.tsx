const Skeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
      >
        <div className="h-48 bg-slate-200"></div>
        <div className="p-5 space-y-3">
          <div className="flex justify-between">
            <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
            <div className="h-4 w-16 bg-slate-200 rounded"></div>
          </div>
          <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-9 flex-1 bg-slate-200 rounded-full"></div>
            <div className="h-9 w-20 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
