import { WebhookSettings } from './types';

export interface ChatRequest {
  question: string;
  sessionId: string;
}

export async function sendChatMessage(
  question: string,
  sessionId: string,
  settings: WebhookSettings
): Promise<string> {
  const payload = {
    question,
    sessionId,
  };

  let url = settings.webhookUrl;
  let options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  // If useProxy is enabled, make the request via our server-side proxy
  if (settings.useProxy) {
    url = '/api/chat';
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        webhookUrl: settings.webhookUrl,
      }),
    };
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown network error');
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    // If response is not JSON, return the raw text
    return text || 'No response';
  }

  // Support array wrappers or various standard key configurations
  if (Array.isArray(data)) {
    data = data[0] ?? {};
  }

  if (data && typeof data === 'object') {
    const answer = data.answer || data.response || data.output || data.message;
    if (answer !== undefined) {
      return String(answer);
    }
    // If none of the keys exist, stringify or search other keys
    const remainingKeys = Object.keys(data);
    if (remainingKeys.length > 0) {
      // Find the first string value or just stringify the whole thing
      for (const key of remainingKeys) {
        if (typeof data[key] === 'string' && data[key].trim().length > 0) {
          return data[key];
        }
      }
    }
    return JSON.stringify(data, null, 2);
  }

  return String(data);
}
