/*
 * This function reconstructs a legal text from a decomposed source.
 * @param  {String} text This is the string, where the reconstructed text will be stored
 * @param  {Array}  dataForReconstruction An array of objects. Each object contains represents a decomposed part of the source.
 * @return {String} The reconstructed text
 */
export default function reconstructText(text, dataForReconstruction) {
  for (const sectionIndex in dataForReconstruction) {
    const currentElement = dataForReconstruction[sectionIndex];

    // get the content based on type.
    // this part could be determined by the type of the ontology
    //TODO:determine the which object key should be used based on the ontology..
    //TODO: determine if html or string should be returned
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
