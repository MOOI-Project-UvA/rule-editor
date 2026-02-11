export function getExecuteBaseUrl() {
  return import.meta.env.VITE_EFLINT_EXECUTE_URL || "http://localhost:8001";
}

export function buildExecuteUrl() {
  const baseUrl = getExecuteBaseUrl();
  return `${baseUrl.replace(/\/+$/, "")}/execute`;
}
