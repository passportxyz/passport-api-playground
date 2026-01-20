interface CodeTemplateParams {
  method: string;
  url: string;
  apiKey: string;
  body?: Record<string, unknown>;
}

export function generateCurlCode({ method, url, apiKey, body }: CodeTemplateParams): string {
  const lines = [`curl -X ${method} "${url}"`];

  if (apiKey) {
    lines.push(`  -H "X-API-Key: ${apiKey}"`);
  }

  lines.push(`  -H "Content-Type: application/json"`);

  if (body && Object.keys(body).length > 0) {
    lines.push(`  -d '${JSON.stringify(body, null, 2)}'`);
  }

  return lines.join(' \\\n');
}

export function generateJavaScriptCode({ method, url, apiKey, body }: CodeTemplateParams): string {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  const fetchOptions: Record<string, unknown> = {
    method,
    headers,
  };

  if (body && Object.keys(body).length > 0) {
    fetchOptions.body = 'JSON.stringify(body)';
  }

  let code = '';

  if (body && Object.keys(body).length > 0) {
    code += `const body = ${JSON.stringify(body, null, 2)};\n\n`;
  }

  code += `const response = await fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')},`;

  if (body && Object.keys(body).length > 0) {
    code += `\n  body: JSON.stringify(body),`;
  }

  code += `
});

const data = await response.json();
console.log(data);`;

  return code;
}

export function generatePythonCode({ method, url, apiKey, body }: CodeTemplateParams): string {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  let code = `import requests

url = "${url}"
headers = ${JSON.stringify(headers, null, 4).replace(/"/g, "'")}
`;

  if (body && Object.keys(body).length > 0) {
    code += `\nbody = ${JSON.stringify(body, null, 4)}\n`;
    code += `\nresponse = requests.${method.toLowerCase()}(url, headers=headers, json=body)`;
  } else {
    code += `\nresponse = requests.${method.toLowerCase()}(url, headers=headers)`;
  }

  code += `\n\nprint(response.json())`;

  return code;
}

export type CodeLanguage = 'curl' | 'javascript' | 'python';

export function generateCode(language: CodeLanguage, params: CodeTemplateParams): string {
  switch (language) {
    case 'curl':
      return generateCurlCode(params);
    case 'javascript':
      return generateJavaScriptCode(params);
    case 'python':
      return generatePythonCode(params);
    default:
      return '';
  }
}
