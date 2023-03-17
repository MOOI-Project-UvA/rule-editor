/*
 * This function extends the RecogitoJS editor by allowing the user to pick a label 
 * in the annotation process by clicking a button.
 * 
*/
export default function createWidget(tagList) {
  return (args) => {
    const tagBody = args.annotation
      ? args.annotation.bodies.find((b) => b.purpose == "tagging")
      : null;
    const currentTag = tagBody ? tagBody.value : null;

    const container = document.createElement("div");
    tagList.forEach((tag) => {
      const button = document.createElement("button");
      button.className =
        tag == currentTag
          ? `label-button ${tag} selected`
          : `label-button ${tag}`;
      button.textContent = tag;
      button.addEventListener("click", () => {
        addTag(tag, args, tagBody);
      });
      container.appendChild(button);
    });
    return container;
  };
}

function addTag(tag, args, tagBody) {
  if (tagBody) {
    args.onUpdateBody(tagBody, {
      type: "TextualBody",
      purpose: "tagging",
      value: tag,
    });
  } else {
    args.onAppendBody({
      type: "TextualBody",
      purpose: "tagging",
      value: tag,
    });
  }
}
