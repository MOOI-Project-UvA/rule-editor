export function getExecuteBaseUrl() {
  return (import.meta.env.VITE_EFLINT_EXECUTE_URL || "").replace(/\/+$/, "");
}

export function getEflintServerBaseUrl() {
  const configured = (import.meta.env.VITE_EFLINT_SERVER_BASE_URL || "").replace(/\/+$/, "");
  if (configured) {
    return configured;
  }
  if (import.meta.env.DEV) {
    return "/eflint-server";
  }
  return "http://localhost:8080";
}

export function buildEflintServerUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getEflintServerBaseUrl()}${normalizedPath}`;
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
