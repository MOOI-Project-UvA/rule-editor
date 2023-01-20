/*
 * This function reconstructs a legal text from a decomposed source.
 * The function is demonstrated in this notebook: https://observablehq.com/@toliosi/reconstructing-text
 * @param  {String} text This is the argument, where the reconstructed text will be stored
 * @param  {Array}  dataForReconstruction An array of objects. Each object contains represents a decomposed part of the source.
 * @return {String} The reconstructed text
 */

export default function reconstructText(text, dataForReconstruction) {
  for (const sectionIndex in dataForReconstruction) {
    const currentElement = dataForReconstruction[sectionIndex];
    console.log("currentElement: ", currentElement);

    // get the content based on type.
    // this part could be determined by the type of the ontology
    //TODO:determine the which object key should be used based on the ontology..
    //TODO: determine if html or string should be returned
    // if (currentElement.type === "Hoofdstuk") {
    //   text += `<p>${currentElement.label}</p>`;
    // } else if (currentElement.type === "Artikel") {
    //   text += `<p>${currentElement.label} ${currentElement.numbering}</p>`;
    // } else {
    //   text += `<p>${currentElement.content}</p>`;
    // }
    if (currentElement.hasOwnProperty("content")) {
      text += `<p>${currentElement.content}</p>`;
    }

    // }

    //check if there are children in the text
    if (currentElement.hasOwnProperty("children")) {
      console.log(
        "I do have children: ",
        typeof currentElement.children,
        currentElement.children
      );
      text += reconstructText("", currentElement.children);
    }
  }
  // console.log("text", text);
  return { text: text, title: "", docID: "" };
}
