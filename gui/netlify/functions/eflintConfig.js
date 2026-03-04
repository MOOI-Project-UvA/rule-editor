export function getTranslationBaseUrl() {
  return (
    process.env.VITE_EFLINT_API_BASE_URL ||
    process.env.PY_SERVICE_URL ||
    "http://localhost:8000"
  );
}

export function buildGenerateEflintUrl() {
  const baseUrl = getTranslationBaseUrl();
  return `${baseUrl.replace(/\/+$/, "")}/generate-eflint`;
}
