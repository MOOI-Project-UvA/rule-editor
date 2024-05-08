import { Snippet } from "./snippet.js"

export class Sentence {
    constructor(documentLeafElement, sourceDocument) {
        this._id = documentLeafElement.id
        this._sourceDocument = sourceDocument
        this._loading = false
        //this._parent = ""
        //level in document structure
        //this._level = 0
        this._snippets = [new Snippet(documentLeafElement.content.trim(), this)]
    }

    get id() { return this._id }
    get snippets() { return this._snippets }
    //get text() { return this._snippets.map(snippet => snippet.text).join() }
    get sourceDocument() { return this._sourceDocument }
}   