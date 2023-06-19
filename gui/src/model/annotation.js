class Annotation {
    constructor() {
        this._occurences = [] //multiple occurences of the same annotation text. Each 
        this._tag = null //the type of annotation (Agent, Action, etc.)
    }

    get tag() { return this._tag }
    set tag(tag) { this._tag = tag }

    addOccurence(
        documentId,
        sentenceId,
        characterRange,
        annotatedText) {
        this._occurences.push(new AnnotationOccurence(documentId,
            sentenceId,
            characterRange,
            annotatedText))
    }

    // go through the document and look for occurences of the annotation text.
    addSimilarOccurences(document) {

    }

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

//a piece of text in the source, can consist of multiple snippets
class AnnotationOccurence {
    constructor(documentId,
        sentenceId,
        characterRange,
        annotatedText) { //text from all snippets together
        this._documentId = documentId
        this._snippets = [new Snippet(sentenceId,
            characterRange,
            annotatedText)]
        this._addingSnippets = false //true if user is in process of adding snippets to this reference
        this._positionOnScreen = null
    }

    addSnippet(sentenceId, characterRange, text) {
        this._snippets.push(new Snippet(sentenceId, characterRange, text))
    }

    get snippets() { return this._snippets }

    get addingSnippets() { return this._addingSnippets }
    set addingSnippets(addingSnippets) { this._addingSnippets = addingSnippets }

    get positionOnScreen() { return this._positionOnScreen }
    set positionOnScreen(positionOnScreen) { this._positionOnScreen = positionOnScreen }

}

// piece of text in the source text, contains of a sentence and a character range
class Snippet {
    constructor(sentenceId, characterRange, text) {
        this._sentenceId = sentenceId,
            this._characterRange = characterRange,
            this._text = text
    }

    get sentenceId() { return this._sentenceId }
    get characterRange() { return this._characterRange }
    get text() { return this._text }
}

export {
    Annotation
}