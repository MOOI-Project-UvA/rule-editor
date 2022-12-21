export default function reconstructText(text, dataForReconstruction) {
  for (const sectionIndex in dataForReconstruction) {
    const currentElement = dataForReconstruction[sectionIndex];

    // get the content based on type.
    // this part could be determined by the type of the ontology
    //TODO:determine the which object key should be used based on the ontology..
    if (currentElement.type === "Hoofdstuk") {
      text += `<p>${currentElement.label}</p>`;
    } else if (currentElement.type === "Artikel") {
      text += `<p>${currentElement.label} ${currentElement.numbering}</p>`;
    } else {
      text += `<p>${currentElement.content}</p>`;
    }

    //check if there are children in the text
    if (currentElement.children) {
      text += reconstructText("", currentElement.children);
    }
  }
  return text;
}
