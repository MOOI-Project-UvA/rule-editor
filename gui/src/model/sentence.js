import { Snippet } from "./snippet.js"

export class Sentence {
    constructor(documentLeafElement) {
        this._id = documentLeafElement.id
        this._loading = false
        //this._parent = ""
        //level in document structure
        //this._level = 0
        this._snippets = [new Snippet(documentLeafElement.content.trim())]
    }

    get id() { return this._id }
    get snippets() { return this._snippets }
    get text() { return this._snippets.map(snippet => snippet.text).join(" ") }
}   