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
    getDocumentForTextPiece
}