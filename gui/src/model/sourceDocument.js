import { Sentence } from "./sentence.js"

export class SourceDocument {
    constructor(chopperDocument, title, selectedSentenceIds) {
        console.log("selectedSentenceIds", selectedSentenceIds)
        this._id = chopperDocument['@id'];
        this._title = title
        //sentences are the leaf elements of the document.
        //keep only those that are selected by the user
        //keep only those that have non-empty content
        const selectedLeafElements = getLeafs(chopperDocument)
            .filter(l => selectedSentenceIds.includes(l.id))
            .filter(l => l.content.length > 0)
        this._sentences = selectedLeafElements.map(element => new Sentence(element, this))
    }

    get id() { return this._id }
    get title() { return this._title }
    get sentences() { return this._sentences }

    getSnippetsForAnnotation(annotation) {
        //check all snippets to see if they contain given annotation
        return this._sentences
            .map(s => s.snippets)
            .flat()
            .filter(snippet =>
                snippet.annotations.some(a => a.id == annotation.id)
            )
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