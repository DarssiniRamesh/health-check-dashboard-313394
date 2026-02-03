/**
 * Runtime environment injection (browser only).
 *
 * This file is loaded by `index.html` and can be replaced/templated by your deployment
 * pipeline to inject environment-specific configuration WITHOUT rebuilding Angular.
 *
 * Example:
 *   window.__env.NG_APP_API_BASE = 'https://vscode-internal-42590-beta.beta01.cloud.kavia.ai:3001';
 */
(function (window) {
  window.__env = window.__env || {};

  // Set this value at deploy/runtime. Keep undefined to use the app default.
  // window.__env.NG_APP_API_BASE = 'http://localhost:3001';
})(window);
