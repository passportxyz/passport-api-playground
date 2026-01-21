'use client';

import { useState, useMemo } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { generateCode, CodeLanguage } from '@/lib/code-templates';
import { isIndividualVerificationEndpoint } from '@/lib/endpoint-config';

interface CodeGeneratorProps {
  method: string;
  url: string;
  apiKey: string;
  body?: Record<string, unknown>;
  endpointId?: string;
}

const baseLanguages: { id: CodeLanguage; label: string; prismLanguage: string }[] = [
  { id: 'curl', label: 'cURL', prismLanguage: 'bash' },
  { id: 'javascript', label: 'JavaScript', prismLanguage: 'javascript' },
  { id: 'python', label: 'Python', prismLanguage: 'python' },
];

const sdkLanguage: { id: CodeLanguage; label: string; prismLanguage: string } = {
  id: 'sdk', label: 'SDK', prismLanguage: 'javascript'
};

export function CodeGenerator({ method, url, apiKey, body, endpointId }: CodeGeneratorProps) {
  const isIVEndpoint = endpointId ? isIndividualVerificationEndpoint(endpointId) : false;

  const languages = useMemo(() => {
    if (isIVEndpoint) {
      return [sdkLanguage, ...baseLanguages];
    }
    return baseLanguages;
  }, [isIVEndpoint]);

  const [activeLanguage, setActiveLanguage] = useState<CodeLanguage>(isIVEndpoint ? 'sdk' : 'curl');
  const [copied, setCopied] = useState(false);

  const code = generateCode(activeLanguage, { method, url, apiKey, body }, endpointId);
  const activeLangConfig = languages.find(l => l.id === activeLanguage)!;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Language tabs */}
      <div className="flex items-center justify-between bg-muted border-b border-border">
        <div className="flex">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLanguage(lang.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeLanguage === lang.id
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code display */}
      <div className="max-h-[400px] overflow-auto">
        <Highlight
          theme={themes.nightOwl}
          code={code}
          language={activeLangConfig.prismLanguage}
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={style} className="p-4 text-sm !bg-code-bg">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
