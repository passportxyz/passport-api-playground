'use client';

interface MethodBadgeProps {
  method: string;
  className?: string;
}

export function MethodBadge({ method, className = '' }: MethodBadgeProps) {
  const baseClasses = 'px-2 py-0.5 text-xs font-bold rounded uppercase';

  const methodClasses: Record<string, string> = {
    GET: 'bg-green-500 text-white',
    POST: 'bg-blue-500 text-white',
    PUT: 'bg-yellow-500 text-black',
    DELETE: 'bg-red-500 text-white',
    PATCH: 'bg-purple-500 text-white',
  };

  const colorClass = methodClasses[method.toUpperCase()] || 'bg-gray-500 text-white';

  return (
    <span className={`${baseClasses} ${colorClass} ${className}`}>
      {method}
    </span>
  );
}
