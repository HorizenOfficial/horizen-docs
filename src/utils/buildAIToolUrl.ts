// ⚠️ TEST-REQUIRED — verify each URL format before shipping (these change without notice)
export const AI_TOOLS = {
  // TEST-REQUIRED: does https://claude.ai/new?q= still pre-fill the prompt?
  claude: 'https://claude.ai/new?q=',
  // TEST-REQUIRED: does https://chatgpt.com/?q= work, or does it need ?hints=search&q=?
  chatgpt: 'https://chatgpt.com/?q=',
  // TEST-REQUIRED: is https://www.perplexity.ai/search?q= still the correct search param?
  perplexity: 'https://www.perplexity.ai/search?q=',
  // TEST-REQUIRED: does https://gemini.google.com/app?q= still pre-fill the prompt?
  gemini: 'https://gemini.google.com/app?q=',
} as const;

export type AITool = keyof typeof AI_TOOLS;

const MAX_ENCODED_LENGTH = 6000;

export function buildAIToolUrl(tool: AITool, pageUrl: string, markdown: string, mdUrl: string): string {
  const inlinePrompt = `Help me with the following documentation page (${pageUrl}):\n\n${markdown}`;
  const inlineEncoded = encodeURIComponent(inlinePrompt);

  const prompt =
    inlineEncoded.length <= MAX_ENCODED_LENGTH
      ? inlinePrompt
      : `Help me with the following documentation page: ${pageUrl}\nThe full markdown is at ${mdUrl}.`;

  return AI_TOOLS[tool] + encodeURIComponent(prompt);
}
