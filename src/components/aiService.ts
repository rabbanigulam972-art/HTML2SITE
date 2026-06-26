/**
 * Free AI HTML editing/generation powered by Pollinations
 * (https://pollinations.ai) — no API key required.
 *
 * Note: requests are sent to a third-party service. The current HTML is
 * included in the prompt so the AI can modify it.
 */

const ENDPOINT = "https://text.pollinations.ai/";

const SYSTEM_PROMPT = `You are an expert front-end web developer assistant built into a live HTML editor. The user gives you their current HTML and a change request (or asks you to create a page from scratch).

Your job: return the COMPLETE updated HTML document with the request applied.

STRICT OUTPUT RULES:
1. Return ONLY raw HTML. No explanations, no comments before/after, no markdown.
2. Never wrap your answer in code fences.
3. Start with <!DOCTYPE html> and end with </html>.
4. Keep ALL existing content unless the user explicitly asks to remove or replace it.
5. Use clean, modern, responsive styling (a <style> block or inline styles).
6. Make it look polished and professional, even for small requests.
7. If the request is vague, make sensible, attractive choices.`;

/** Strip markdown fences and leading prose so we keep pure HTML. */
export function cleanHtml(raw: string): string {
  let s = raw.trim();

  // 1) Pull content out of a ```html ... ``` fence if present
  const fence = s.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();

  // 2) Cut any prose that appears before the document starts
  const start = s.search(/<!doctype html|<html[\s>]/i);
  if (start > 0) s = s.slice(start);

  // 3) Trim trailing junk after the closing tag
  const end = s.lastIndexOf("</html>");
  if (end >= 0) s = s.slice(0, end + "</html>".length);

  return s.trim();
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Request timed out")), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (err) => {
        clearTimeout(t);
        reject(err);
      }
    );
  });
}

/**
 * Ask the AI to edit the current HTML (or generate from nothing).
 */
export async function editHtmlWithAI(
  currentHtml: string,
  instruction: string
): Promise<string> {
  const trimmed = instruction.trim();
  if (!trimmed) throw new Error("Please describe what you want to change.");

  const hasHtml = currentHtml.trim().length > 0;
  const userMessage = hasHtml
    ? `CURRENT HTML:\n${currentHtml}\n\nREQUEST: ${trimmed}\n\nReturn the full updated HTML document only.`
    : `REQUEST: ${trimmed}\n\nCreate a complete, modern, responsive HTML page for this request. Return only the HTML.`;

  const res = await withTimeout(
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        model: "openai",
        seed: Math.floor(Math.random() * 1_000_000),
        temperature: 0.7,
      }),
    }),
    75_000
  );

  if (!res.ok) {
    throw new Error(`The AI service is busy (HTTP ${res.status}). Please try again.`);
  }

  const contentType = res.headers.get("content-type") || "";
  let content: string;
  if (contentType.includes("application/json")) {
    const json = await res.json();
    content =
      json?.choices?.[0]?.message?.content ??
      json?.content ??
      (typeof json === "string" ? json : JSON.stringify(json));
  } else {
    content = await res.text();
  }

  const cleaned = cleanHtml(content);
  if (!cleaned || !/<html[\s>]/i.test(cleaned)) {
    throw new Error(
      "The AI didn't return valid HTML. Try rephrasing your request."
    );
  }
  return cleaned;
}

/**
 * Tiny offline fallback for the most common requests, used only if the
 * network/AI is unavailable. Keeps the tool feeling helpful.
 */
export function localFallback(currentHtml: string, instruction: string): string {
  const t = instruction.toLowerCase();
  let css = "";
  const hasStyle = /<style[\s>]/i.test(currentHtml);

  if (/(dark\s?(mode|theme))|night/.test(t)) {
    css =
      "body{background:#0f172a;color:#e2e8f0;margin:0;font-family:system-ui,sans-serif;padding:24px;line-height:1.6}a{color:#818cf8}";
  } else if (/blue.*(background|theme|bg)/.test(t) || /background.*blue/.test(t)) {
    css =
      "body{background:#eff6ff;color:#1e3a8a;margin:0;font-family:system-ui,sans-serif;padding:24px;line-height:1.6}";
  } else if (/center/.test(t)) {
    css =
      "body{display:flex;min-height:100vh;margin:0;align-items:center;justify-content:center;text-align:center;font-family:system-ui,sans-serif;padding:24px}";
  } else {
    css =
      "body{font-family:system-ui,Segoe UI,Roboto,sans-serif;line-height:1.6;margin:0;padding:24px}";
  }

  const styleBlock = `<style>${css}</style>`;
  if (hasStyle) {
    return currentHtml.replace(/<style[\s>][\s\S]*?<\/style>/i, styleBlock);
  }
  if (/<\/head>/i.test(currentHtml)) {
    return currentHtml.replace(/<\/head>/i, `${styleBlock}</head>`);
  }
  if (/<body[\s>]/i.test(currentHtml)) {
    return currentHtml.replace(/(<body[^>]*>)/i, `$1${styleBlock}`);
  }
  return `${styleBlock}\n${currentHtml}`;
}
