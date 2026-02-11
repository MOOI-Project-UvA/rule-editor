export function getTranslationBaseUrl() {
  return (
    process.env.FLINT_TRANSLATION_URL ||
    process.env.PY_SERVICE_URL ||
    "http://localhost:8000"
  );
}

export function buildGenerateEflintUrl() {
  const baseUrl = getTranslationBaseUrl();
  return `${baseUrl.replace(/\/+$/, "")}/generate-eflint`;
}
