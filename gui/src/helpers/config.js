// icons per frame type
const icons = {
  agent: "mdi-account-switch",
  object: "mdi-account-arrow-left-outline",
  action: "mdi-gesture-tap",
  duty: "mdi-exclamation",
  other: "mdi-circle-small",
  act: "mdi-autorenew",
  claim_duty: "mdi-square",
  nlp: "mdi-text-recognition",
};

// colors per frame type / frame subtype
const colors = {
  fact: "primary",
  agent: "warning",
  object: "accent",
  action: "secondary",
  duty: "info",
  act: "deep-purple-10",
  claim_duty: "deep-purple-10",
};

const hexColors = {
  fact: "#1976D2",
  agent: "#F2C037",
  object: "#9C27B0",
  action: "#26A69A",
  duty: "#31CCEC",
  act: "rgb(49, 27, 146)",
  claim_duty: "rgb(49, 27, 146)",
};

export { icons, colors, hexColors };
