export function getExecuteBaseUrl() {
  return import.meta.env.VITE_EFLINT_EXECUTE_URL || "http://localhost:8001";
}

export function buildExecuteUrl() {
  const baseUrl = getExecuteBaseUrl();
  return `${baseUrl.replace(/\/+$/, "")}/execute`;
}

export function buildReplUrl() {
  const baseUrl = getExecuteBaseUrl();
  return `${baseUrl.replace(/\/+$/, "")}/repl`;
}

export function buildReplSessionStartUrl() {
  const baseUrl = getExecuteBaseUrl();
  return `${baseUrl.replace(/\/+$/, "")}/repl/session/start`;
}

export function buildReplSessionInputUrl(sessionId) {
  const baseUrl = getExecuteBaseUrl();
  return `${baseUrl.replace(/\/+$/, "")}/repl/session/${encodeURIComponent(sessionId)}/input`;
}

export function buildReplSessionStopUrl(sessionId) {
  const baseUrl = getExecuteBaseUrl();
  return `${baseUrl.replace(/\/+$/, "")}/repl/session/${encodeURIComponent(sessionId)}/stop`;
}
