import { Snippet } from "./snippet.js";

export class Sentence {
  constructor(id, sourceDocument) {
    this._id = id;
    this._iri = null;
    this._sourceDocument = sourceDocument;
    this._loading = false;
    this._snippets = [];
    this._text = "";
    this._parent = null
    this._checked = true;
    this._children = []
    this._contentType = "",
      this._level = null
  }

  //set text and create snippets. if there are snippets (from a loaded interpretation)
  //add missing snippets, else create one snippet covering the complete sentence
  addTextFromChopperLeafElement(content) {
    this._text = content.trim();
    if (this._snippets.length == 0) {
      this._snippets.push(
        new Snippet(this._text, this, [0, this._text.length]),
      );
    } else {
      const missingSnippets = findMissingSnippets(this);
      this._snippets = this._snippets.concat(missingSnippets);
      console.log("this._snippets", this._snippets);
      this._snippets.sort(
        (s1, s2) => s1.characterRange[0] - s2.characterRange[0],
      );
    }
  }

  get id() {
    return this._id;
  }

  get iri() {
    return this._iri;
  }
  set iri(iri) {
    this._iri = iri;
  }
  get parent() { return this._parent }
  set parent(parent) {
    this._parent = parent
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
  get children() { return this._children }
  addChild(child) { this._children.push(child) }

  set contentType(contentType) { this._contentType = contentType }
  get contentType() { return this._contentType }

  //return sentence tree as list, do not include empty sentences
  get sentenceTreeAsList() {
    let list = this._text.length == 0 ? [] : [this]
    this._children.forEach(child => {
      list = list.concat(child.sentenceTreeAsList)
    })
    return list
  }
  //level in sentence hierarchy
  set level(level) { this._level = level }
  get level() { return this._level }
}
//add snippets not covered by annotations
function findMissingSnippets(sentence) {
  //sort existing snippets on range (start)
  sentence.snippets.sort(
    (s1, s2) => s1.characterRange[0] - s2.characterRange[0],
  );
  let missingSnippets = [];
  let rangeStart = 0;
  sentence.snippets.forEach((existingSnippet) => {
    const rangeEnd = existingSnippet.characterRange[0]; //end of current snippet is start of next one
    if (rangeStart < rangeEnd) {
      const snippetText = sentence.text.substring(rangeStart, rangeEnd);
      const snippet = new Snippet(snippetText, sentence, [
        rangeStart,
        rangeEnd,
      ]);
      missingSnippets.push(snippet);
    }
    rangeStart = existingSnippet.characterRange[1];
  });
  //add last snippet to the end
  if (rangeStart < sentence.text.length) {
    const snippetText = sentence.text.substring(
      rangeStart,
      sentence.text.length,
    );
    const snippet = new Snippet(snippetText, sentence, [
      rangeStart,
      sentence.text.length,
    ]);
    missingSnippets.push(snippet);
  }
  return missingSnippets;
}
