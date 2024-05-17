import { Snippet } from "./snippet.js";

export class Sentence {
  constructor(id, sourceDocument) {
    this._id = id;
    this._sourceDocument = sourceDocument;
    this._loading = false;
    this._checked = true;
    this._snippets = [];
    this._text = "";
  }

  //set text and create sniippets. if there are snippets (from a loaded interpretation)
  //add missing snippets, else create one snippet covering the complete sentence
  addTextFromChopperLeafElement(documentLeafElement) {
    this._text = documentLeafElement.content.trim();
    if (this._snippets.length == 0) {
      this._snippets.push(
        new Snippet(this._text, this, [0, this._text.length]),
      );
    } else {
      addMissingSnippets(this._text, this._snippets);
    }
  }

  get id() {
    return this._id;
  }
  get snippets() {
    return this._snippets;
  }
  get text() {
    return this._text;
  }
  get sourceDocument() {
    return this._sourceDocument;
  }
  get checked() {
    return this._checked;
  }

  set checked(checked) {
    this._checked = checked;
  }
}

//add snippets not covered by annotations
function addMissingSnippets(sentenceText, snippets) {
  console.log("addMissingSnippets", sentenceText, snippets);
  //sort existing snippets on range (start)
  snippets.sort((s1, s2) => s1.characterRange[0] - s2.characterRange[0]);
  console.log("snippets", snippets);
  let missingSnippets = [];
  let rangeStart = 0;
  snippets.forEach((existingSnippet) => {
    const rangeEnd = existingSnippet.characterRange[0]; //end of current snippet is start of next one
    if (rangeStart < rangeEnd) {
      const snippetText = sentenceText.substring(rangeStart, rangeEnd);
      const snippet = new Snippet(snippetText, [rangeStart, rangeEnd]);
      missingSnippets.push(snippet);
    }
    rangeStart = existingSnippet.characterRange[1];
  });
  //add last snippet to the end
  if (rangeStart < sentenceText.length) {
    const snippetText = sentenceText.substring(rangeStart, sentenceText.length);
    const snippet = new Snippet(snippetText, [rangeStart, sentenceText.length]);
    missingSnippets.push(snippet);
  }
  console.log("missingSnippets", missingSnippets);
  //extend current snippets with missing snippets
  snippets = snippets.concat(missingSnippets);
}
