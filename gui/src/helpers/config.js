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

//used for underlining
const hexColors = {
  fact: "#1976D2",
  agent: "#F2C037",
  object: "#9C27B0",
  action: "#26A69A",
  duty: "#31CCEC",
  act: "#311b92",
  claim_duty: "#311b92",
};

//used for highlighting and node colors in network
const hexColorsLight = {
  fact: "#b3d9ff",
  agent: "#ffdd80",
  object: "#f4b3ff",
  action: "#80fff3",
  duty: "#80e9ff",
  act: "#c0b3ff",
  claim_duty: "#c0b3ff",
  list: "#ffffff",
  booleanConstruct: "#ffffff"
};

//used for sizing nodes in network
const nodeSizes = {
  fact: 5,
  act: 10,
  claim_duty: 10,
  anonymous: 3
}

export { icons, colors, hexColors, hexColorsLight, nodeSizes };
