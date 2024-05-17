import { Snippet } from "./snippet.js"

export class Sentence {
    constructor(id, iri, sourceDocument) {
        this._id = id
        this._iri = iri
        this._sourceDocument = sourceDocument
        this._loading = false
        this._snippets = []
        this._text = ""
    }

    //set text and create sniippets. if there are snippets (from a loaded interpretation)
    //add missing snippets, else create one snippet covering the complete sentence 
    addTextFromChopperLeafElement(documentLeafElement) {
        this._text = documentLeafElement.content.trim()
        if (this._snippets.length == 0) {
            this._snippets.push(new Snippet(this._text, this, [0, this._text.length]))
        } else {
            const missingSnippets = findMissingSnippets(this)
            this._snippets = this._snippets.concat(missingSnippets)
            console.log("this._snippets", this._snippets)
            this._snippets.sort((s1, s2) => s1.characterRange[0] - s2.characterRange[0])
        }
    }

    get id() { return this._id }
    get iri() { return this._iri }
    set iri(iri) { this._iri = iri }
    get snippets() { return this._snippets }
    get text() { return this._text }
    get sourceDocument() { return this._sourceDocument }
}

//add snippets not covered by annotations
function findMissingSnippets(sentence) {
    console.log("addMissingSnippets", sentence)
    //sort existing snippets on range (start)
    sentence.snippets.sort((s1, s2) => s1.characterRange[0] - s2.characterRange[0])
    let missingSnippets = []
    let rangeStart = 0
    sentence.snippets.forEach(existingSnippet => {
        const rangeEnd = existingSnippet.characterRange[0] //end of current snippet is start of next one
        if (rangeStart < rangeEnd) {
            const snippetText = sentence.text.substring(rangeStart, rangeEnd)
            const snippet = new Snippet(snippetText, sentence, [rangeStart, rangeEnd])
            missingSnippets.push(snippet)
        }
        rangeStart = existingSnippet.characterRange[1]
    })
    //add last snippet to the end
    if (rangeStart < sentence.text.length) {
        const snippetText = sentence.text.substring(rangeStart, sentence.text.length)
        const snippet = new Snippet(snippetText, sentence, [rangeStart, sentence.text.length])
        missingSnippets.push(snippet)
    }
    console.log("missingSnippets", missingSnippets)
    //extend current snippets with missing snippets
    return missingSnippets
}