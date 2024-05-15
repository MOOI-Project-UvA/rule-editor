import { Snippet } from "./snippet.js"

export class Sentence {
    constructor(documentLeafElement, sourceDocument) {
        this._id = documentLeafElement.id
        this._sourceDocument = sourceDocument
        this._loading = false
        //this._parent = ""
        //level in document structure
        //this._level = 0
        const text = documentLeafElement.content.trim()
        this._snippets = [new Snippet(text, this, [0, text.length - 1])]
    }

    get id() { return this._id }
    get snippets() { return this._snippets }
    //get text() { return this._snippets.map(snippet => snippet.text).join() }
    get sourceDocument() { return this._sourceDocument }
}   