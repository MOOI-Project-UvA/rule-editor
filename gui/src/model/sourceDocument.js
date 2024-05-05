import { Sentence } from "./sentence.js"

export class SourceDocument {
    constructor(chopperDocument, title, selectedSentenceIds) {
        console.log("selectedSentenceIds", selectedSentenceIds)
        this._id = chopperDocument['@id'];
        this._title = title
        //sentences are the leaf elements of the document.
        //keep only those that are selected by the user
        //keep only those that have non-empty content
        this._sentences = setSentenceListFromDocument(chopperDocument)
            .filter(s => selectedSentenceIds.includes(s.id))
            .filter(s => s.text.length > 0)
    }

    get id() { return this._id }
    get title() { return this._title }

    get sentences() { return this._sentences }

}

//doc is a hierarchy of elements. Its leafs are the sentences, containing the textual content.
//get the leafs in the correct order, in a list.
function setSentenceListFromDocument(doc) {
    const leafElements = getLeafs(doc)
    return leafElements.map(element => new Sentence(element))
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