import { Sentence } from "./sentence.js"

export class SourceDocument {
    constructor(id, selectedSentenceIds) {
        //console.log("selectedSentenceIds", selectedSentenceIds)
        this._id = id
        this._title = ""
        this._sentences = []
        this._selectedSentenceIds = selectedSentenceIds

        console.log("created source document", this)
    }

    get id() { return this._id }
    set title(title) { this._title = title }
    get title() { return this._title }
    set sentences(sentences) { this._sentences = sentences }
    get sentences() { return this._sentences }

    //add sentences and id from chopperDocument
    fillSentencesFromChopperDocument(chopperDocument) {
        console.log("fillSentencesFromChopperDocument")
        //sentences are the leaf elements of the document.
        //keep only those that are selected by the user, or if user
        //did not select any sentences: keep all
        //keep only those that have non-empty content
        const selectedLeafElements = getLeafs(chopperDocument)
            .filter(l => this._selectedSentenceIds == null
                || this._selectedSentenceIds.length == 0
                || this._selectedSentenceIds.includes(l.id))
            .filter(l => l.content.length > 0)
        //only create new sentence when not yet present
        selectedLeafElements.forEach(element => {
            let sentence = this._sentences.find(s => s.id == element.id)
            if (!sentence) {
                sentence = new Sentence(element.id, this)
                this._sentences.push(sentence)
            }
            sentence.addTextFromChopperLeafElement(element)
        })
    }

    getSnippetsForAnnotation(annotation) {
        //check all snippets to see if they contain given annotation
        return this._sentences
            .map(s => s.snippets)
            .flat()
            .filter(snippet =>
                snippet.annotations.some(a => a.id == annotation.id)
            )
    }

    getAnnotationsForFrame(frame) {
        const annotations = this._sentences
            .map(s => s.snippets.map(snippet => snippet.annotations))
            .flat()
            .flat()
            .filter((annotation, index, array) => array.findIndex(a => a.id == annotation.id) === index)

        return annotations.filter(a => a.frame.id == frame.id)
    }

    deleteAnnotationsForFrame(frame) {

    }

    //remove annotation from snippets
    deleteAnnotation(annotation) {
        const snippets = this._sentences
            .map(s => s.snippets)
            .flat()
        snippets.forEach(s => s.deleteAnnotation(annotation))
    }

    //return all sentences that have snippets with annotations for frame
    getSentencesForFrame(frame) {
        return this._sentences.filter(sentence =>
            sentence.snippets.some(snippet => snippet.annotations.some(a => a.frame && a.frame.id == frame.id))
        )
    }
}

function getLeafs(node) {
    let leafs = []
    if ('children' in node && node.children.length > 0) {
        node.children.forEach(child => {
            leafs = leafs.concat(getLeafs(child))
        })
    } else {
        leafs = [node]
    }
    return leafs
}

//adds a parent attribute for each part of the document
//so we can easily get the paragraph (etc) that a sentence is
//part of
function addParentReferencesToDocument(document) {
    if ('children' in document) {
        document.children.forEach(c => {
            c.parent = document
            addParentReferencesToDocument(c)
        })
    }
}