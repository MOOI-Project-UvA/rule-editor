import { Notify } from "quasar";

export const alertWidget = (type, message) => {
  switch (type) {
    case "error":
      Notify.create({
        message: message,
        color: "negative",
        icon: "mdi-alert-circle-outline",
        position: "top",
        actions: [
          {
            label: "Dismiss",
            color: "white",
          },
        ],
      });
      break;

    case "success":
      Notify.create({
        message: message,
        color: "teal",
        icon: "mdi-check-circle-outline",
        position: "top",
        actions: [
          {
            label: "Dismiss",
            color: "white",
          },
        ],
      });
      break;

    case "welcome":
      Notify.create({
        message: message,
        color: "teal",
        icon: "mdi-human-greeting",
        position: "top",
        html: true,
        timeout: 0,
        actions: [
          {
            label: "Dismiss",
            color: "white",
          },
        ],
      });
      break;
  }
};
