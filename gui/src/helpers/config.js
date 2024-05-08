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
  act: "primary",
  claim_duty: "primary",
};

const hexColors = {
  fact: "#1976D2",
  agent: "#F2C037",
  object: "#9C27B0",
  action: "#26A69A",
  duty: "#31CCEC",
  act: "#1976D2",
  claim_duty: "#1976D2",
};

export { icons, colors, hexColors };
