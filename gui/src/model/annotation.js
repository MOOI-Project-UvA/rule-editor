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
        snippet.annotation = this
        this._snippets = [...this._snippets, snippet]
    }

    addSimilarAnnotationsToFrame(documents) {
        //for now: only add similar annotations, if current annotation consists of one snippet
        if (this.snippets.length == 1) {
            const searchSnippet = this.snippets[0]
            documents.forEach(document => {
                getSentencesInDocument(document).forEach(sentence => {
                    const index = sentence.content.toLowerCase().indexOf(searchSnippet.text.toLowerCase())
                    if (index != -1 && (
                        //TODO
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
            snippets: this.snippets.map(s => s.toFlatObject()),
            positionOnScreen: this.positionOnScreen
        }
    }

    fromFlatObject(data) {
        this.positionOnScreen = data.positionOnScreen
        data.snippets.forEach(s => {
            let snippet = new Snippet()
            snippet.fromFlatObject(s)
            this.addSnippet(snippet)
        })
    }

}

// piece of consecutive text within a sentence in the source text, contains of a sentence and a character range
class Snippet {
    constructor(sentence, characterRange, text) {
        this._id = uuid4() //unique ID
        this._sentence = sentence
        this._characterRange = characterRange
        this._text = text
        this._annotation = null //annotation that this snippet is part of
    }

    get id() { return this._id }
    get sentence() { return this._sentence }
    get characterRange() { return this._characterRange }
    get text() { return this._text }
    get annotation() { return this._annotation }
    set annotation(annotation) { this._annotation = annotation }


    toFlatObject() {
        return {
            //TODO!
            documentId: this.documentId,
            sentenceId: this.sentenceId,
            characterRange: this.characterRange,
            text: this.text
        }
    }

    fromFlatObject(data) {
        //TODO
        this._documentId = data.documentId
        this._sentenceId = data.sentenceId
        this._characterRange = data.characterRange
        this._text = data.text
    }
}

export {
    Annotation,
    Snippet
}
