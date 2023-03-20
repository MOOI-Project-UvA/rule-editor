//recursively get elements with content
function getSentencesInDocument(document) {
    let sentences = 'content' in document ? [document] : []
    if ('children' in document) {
        document.children.forEach(c => {
            sentences = sentences.concat(getSentencesInDocument(c))
        })
    }
    return sentences
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

//returns document that the piece of text is part of
function getDocumentForTextPiece(textPiece) {
    if ('parent' in textPiece && textPiece.parent) {
        return getDocumentForTextPiece(textPiece.parent)
    } else {
        return textPiece //we have reached the top of the tree, textPiece == document
    }
}
export {
    getSentencesInDocument,
    addParentReferencesToDocument,
    getDocumentForTextPiece
}