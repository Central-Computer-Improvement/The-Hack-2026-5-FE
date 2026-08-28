const VARIANT_CLASSES = {
  urgent:  'bg-red-100 text-red-700 border border-red-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  fresh:   'bg-emerald-100 text-emerald-700 border border-emerald-200',
  info:    'bg-blue-100 text-blue-700 border border-blue-200',
  orange:  'bg-orange-100 text-orange-700 border border-orange-200',
  gray:    'bg-gray-100 text-gray-600 border border-gray-200',
};

export default function Badge({ variant = 'fresh', label, className = '' }) {
  const classes = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.gray;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${classes} ${className}`}
    >
      {label}
    </span>
  );
}
