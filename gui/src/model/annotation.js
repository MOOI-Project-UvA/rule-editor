import { v4 as uuid4 } from 'uuid'
import { getSentencesInDocument } from '../helpers/document'
import { store } from '../store/index.js'


class Annotation {
    constructor() {
        this._snippets = [] //an annotation is a sequence of text snippets possibly in different sentences
        this._frame //fact, act, or duty that is annotation is the source of
        this._positionOnScreen = null
        this._addingToExistingFrame = false //true if user wants to add this annotation to an existing frame
    }

    get frame() { return this._frame }
    set frame(frame) { this._frame = frame }

    get positionOnScreen() { return this._positionOnScreen }
    set positionOnScreen(positionOnScreen) { this._positionOnScreen = positionOnScreen }

    get addingToExistingFrame() { return this._addingToExistingFrame }
    set addingToExistingFrame(addingToExistingFrame) { this._addingToExistingFrame = addingToExistingFrame }

    get snippets() { return this._snippets }

    get sourceText() { return this._snippets.map(s => s.text).join(" ") }

    addSnippet(snippet) {
        console.log("adding snippet")
        snippet.annotation = this
        this._snippets = [...this._snippets, snippet]
    }

    addSimilarAnnotationsToFrame(documents) {
        //for now: only add similar annotations, if current annotation consists of one snippet only
        if (this.snippets.length == 1) {
            const searchSnippet = this.snippets[0]
            documents.forEach(document => {
                getSentencesInDocument(document).forEach(sentence => {
                    const index = sentence.content.toLowerCase().indexOf(searchSnippet.text.toLowerCase())
                    if (index != -1 && (
                        searchSnippet.documentId != document['@id'] ||
                        searchSnippet.sentenceId != sentence['id'] //||
                        //searchSnippet.range[0] != index
                    )) {
                        const snippet = new Snippet(
                            document['@id'],
                            sentence['id'],
                            [index, index + searchSnippet.text.length],
                            searchSnippet.text
                        )
                        let similarAnnotation = new Annotation()
                        similarAnnotation.addSnippet(snippet)
                        this.frame.addAnnotation(similarAnnotation)
                        store.commit("addAnnotation", similarAnnotation)
                    }
                })
            })
        }
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

// piece of consecutive text within a sentence in the source text, contains of a sentence and a character range
class Snippet {
    constructor(documentId, sentenceId, characterRange, text) {
        this._id = uuid4() //unique ID
        this._documentId = documentId
        this._sentenceId = sentenceId
        this._characterRange = characterRange
        this._text = text
        this._annotation = null //annotation that this snippet is part of
    }

    get id() { return this._id }
    get documentId() { return this._documentId }
    get sentenceId() { return this._sentenceId }
    get characterRange() { return this._characterRange }
    get text() { return this._text }
    get annotation() { return this._annotation }
    set annotation(annotation) { this._annotation = annotation }


    toFlatObject() {
        return {}
    }
}

export {
    Annotation,
    Snippet
}
