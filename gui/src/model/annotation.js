class Annotation {
    constructor() {
        this._snippets = [] //an annotation is a sequence of text snippets 
        this._frame //fact, act, or duty that is annotation is the source of
        this._positionOnScreen = null
    }

    get frame() { return this._frame }
    set frame(frame) { this._frame = frame }

    get snippets() { return this._snippets }

    addSnippet(snippet) {
        console.log("adding snippet")
        snippet.annotation = this
        this._snippets = [...this._snippets, snippet]
    }

    get positionOnScreen() { return this._positionOnScreen }
    set positionOnScreen(positionOnScreen) { this._positionOnScreen = positionOnScreen }

    //returns flat object, with references to other objects by ID
    toFlatObject() {
        return {
            documentId: this._documentId,
            sentenceId: this._sentenceId,
            characterRange: this._characterRange,
            annotatedText: this._annotatedText,
            tag: this._tag
        }
    }

}

// piece of consecutive text within a sentence in the source text, contains of a sentence and a character range
class Snippet {
    constructor(documentId, sentenceId, characterRange, text) {
        this._documentId = documentId
        this._sentenceId = sentenceId
        this._characterRange = characterRange
        this._text = text
        this._annotation = null //annotation that this snippet is part of
    }

    get documentId() { return this._documentId }
    get sentenceId() { return this._sentenceId }
    get characterRange() { return this._characterRange }
    get text() { return this._text }

    set annotation(annotation) { this._annotation = annotation }


    toFlatObject() {
        return {}
    }
}

export {
    Annotation,
    Snippet
}
