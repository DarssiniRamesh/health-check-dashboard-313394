/**
 * Centralized environment configuration (prod).
 *
 * Supports runtime injection via `window.__env` (see `src/assets/env.js`) so that
 * `NG_APP_API_BASE` can be changed without rebuilding the app.
 *
 * SSR-safe: `window` access is guarded.
 */

function readRuntimeEnv(key: string): string | undefined {
  // SSR safe guard
  const w = typeof window !== 'undefined' ? (window as any) : undefined;
  const fromWindow = w?.__env?.[key];

  // `process.env` may exist in some build setups; keep it as a secondary option.
  const fromProcess = (typeof process !== 'undefined' ? (process as any)?.env?.[key] : undefined) as
    | string
    | undefined;

  const value = (fromWindow ?? fromProcess) as unknown;
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

const defaultBackendApiUrl = 'https://vscode-internal-33473-beta.beta01.cloud.kavia.ai:3002';

/**
 * Base URL for backend API calls.
 * When `NG_APP_API_BASE` is provided, it must be a full origin (e.g. https://host:3001).
 */
const apiBaseUrl = (readRuntimeEnv('NG_APP_API_BASE') ?? defaultBackendApiUrl).replace(/\/$/, '');

export const environment = {
  production: true,

  // Keep existing key for compatibility with any existing code.
  BACKEND_API_URL: defaultBackendApiUrl,

  // New preferred key used by API services.
  apiBaseUrl,
};
