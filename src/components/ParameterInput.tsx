'use client';

import { Parameter } from '@/types/api';

interface ParameterInputProps {
  parameter: Parameter;
  value: string;
  onChange: (value: string) => void;
}

export function ParameterInput({ parameter, value, onChange }: ParameterInputProps) {
  const inputType = parameter.schema.type === 'integer' || parameter.schema.type === 'number'
    ? 'number'
    : parameter.schema.type === 'boolean'
      ? 'checkbox'
      : 'text';

  const placeholder = parameter.schema.default !== undefined
    ? `Default: ${parameter.schema.default}`
    : parameter.schema.type || 'Enter value';

  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-sm font-medium">
        <span>{parameter.name}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${
          parameter.in === 'path' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
          parameter.in === 'query' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }`}>
          {parameter.in}
        </span>
        {parameter.required && (
          <span className="text-red-500 text-xs">required</span>
        )}
      </label>

      {parameter.description && (
        <p className="text-xs text-muted-foreground">{parameter.description}</p>
      )}

      {parameter.schema.enum ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select {parameter.name}</option>
          {parameter.schema.enum.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : inputType === 'checkbox' ? (
        <input
          type="checkbox"
          checked={value === 'true'}
          onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
      ) : (
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
        />
      )}

      {parameter.schema.type && (
        <p className="text-xs text-muted-foreground">
          Type: <code className="px-1 py-0.5 bg-muted rounded">{parameter.schema.type}</code>
        </p>
      )}
    </div>
  );
}
