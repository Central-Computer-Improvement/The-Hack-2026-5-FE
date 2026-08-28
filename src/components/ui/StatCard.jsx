export default function StatCard({
  title,
  value,
  subtext,
  icon,
  iconBg = 'bg-emerald-50',
  trend,
  className = '',
}) {
  return (
    <div
      className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider truncate">
          {title}
        </p>
        <p className="text-2xl font-black text-gray-900 mt-0.5 leading-tight">
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-gray-500 mt-0.5 font-medium">{subtext}</p>
        )}
        {trend && (
          <p className="text-xs font-semibold text-emerald-600 mt-1">{trend}</p>
        )}
      </div>
    </div>
  );
}
