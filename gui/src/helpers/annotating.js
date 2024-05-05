//helper functions for selecting text when annotating
//these manage splitting a sentence into snippets, to allow
//nested annotations, and corresponding underlining of text

export function getSelectionAsSnippets(selection, sentences) {
    let startSentenceIndex
    let endSentenceIndex
    let startSnippet
    let endSnippet
    let startOffset //within snippet
    let endOffset //within snippet
    //divs have data-sentence-id and data-snippet-id
    //div is the parent-node of selection (which is a text node)
    //sentence of start of selection
    const anchorSentence = sentences.find(s => s.id == selection.anchorNode.parentNode.dataset.sentenceId)
    const focusSentence = sentences.find(s => s.id == selection.focusNode.parentNode.dataset.sentenceId)
    //selection started in this snippet (anchorNode)
    const anchorSnippet = anchorSentence.snippets.find(s => s.id == selection.anchorNode.parentNode.dataset.snippetId)
    //selection ended in this snippet (focusNode)
    const focusSnippet = focusSentence.snippets.find(s => s.id == selection.focusNode.parentNode.dataset.snippetId)
    const anchorSentenceIndex = sentences.findIndex(s => s.id == anchorSentence.id)
    const focusSentenceIndex = sentences.findIndex(s => s.id == focusSentence.id)

    if (anchorSentenceIndex > focusSentenceIndex) { //user selected from right to left
        startSnippet = focusSnippet //first snippet in selection
        endSnippet = anchorSnippet //last snippet in selection
        startOffset = selection.focusOffset
        endOffset = selection.anchorOffset
        startSentenceIndex = focusSentenceIndex
        endSentenceIndex = anchorSentenceIndex
    } else if (anchorSentenceIndex == focusSentenceIndex) {
        //anchor and focussnippet are in the same sentence. Check the order of the snippets
        //using the index of both within the sentence
        const anchorSnippetIndex = sentences[anchorSentenceIndex].snippets.findIndex(s => s.id == anchorSnippet.id)
        const focusSnippetIndex = sentences[focusSentenceIndex].snippets.findIndex(s => s.id == focusSnippet.id)
        startSentenceIndex = focusSentenceIndex //same as anchorsentenceindex
        endSentenceIndex = anchorSentenceIndex
        if (anchorSnippetIndex > focusSnippetIndex) { //user selected from right to left
            startSnippet = focusSnippet //first snippet in selection
            endSnippet = anchorSnippet //last snippet in selection
            startOffset = selection.focusOffset
            endOffset = selection.anchorOffset
        } else if (anchorSnippetIndex == focusSnippetIndex) {
            startSnippet = anchorSnippet //start and end snippet are the same
            endSnippet = focusSnippet //start and end snippet are the same
            //within this snippet, check if user selected from right to left, or left to right
            if (selection.anchorOffset > selection.focusOffset) { //user selected from right to left
                startOffset = selection.focusOffset
                endOffset = selection.anchorOffset
            } else { //user selected from left to right
                startOffset = selection.anchorOffset
                endOffset = selection.focusOffset
            }
        } else { //user selected from left to right
            startSnippet = anchorSnippet //first snippet in selection
            endSnippet = focusSnippet //last snippet in selection
            startOffset = selection.anchorOffset
            endOffset = selection.focusOffset
        }
    } else { //anchorSentenceIndex < focusSentenceIndex, user selected from left to right
        startSnippet = anchorSnippet //first snippet in selection
        endSnippet = focusSnippet //last snippet in selection
        startOffset = selection.anchorOffset
        endOffset = selection.focusOffset
        startSentenceIndex = anchorSentenceIndex
        endSentenceIndex = focusSentenceIndex
    }
    return {
        startSentenceIndex: startSentenceIndex,
        endSentenceIndex: endSentenceIndex,
        startSnippet: startSnippet,
        endSnippet: endSnippet,
        startOffset: startOffset,
        endOffset: endOffset
    }
}

export function splitAndReturnSelectedSnippets(
    selectionAsSnippets,
    sentences) {
    //destructure
    const { startSentenceIndex, endSentenceIndex, startSnippet, endSnippet, startOffset, endOffset } = selectionAsSnippets
    //split start snippet and replace it in the sentence by the two new snippets
    const startSubSnippets = splitSnippet(startSnippet, startOffset, sentences)
    let endSubSnippets
    //if startsnippet and endsnippet are the same, split the rightmost startSubSnippet
    //else split the endsnippet
    if (startSnippet == endSnippet) {
        endSubSnippets = splitSnippet(
            startSubSnippets[1],
            endOffset - startOffset,
            sentences
        )
    } else {
        endSubSnippets = splitSnippet(endSnippet, endOffset, sentences)
    }
    //collect all snippets covered by the selection
    let selectionSnippets = []
    const startSnippetIndexInSentence = sentences[startSentenceIndex].snippets.findIndex(s => s.id == startSubSnippets[1].id)
    const endSnippetIndexInSentence = sentences[endSentenceIndex].snippets.findIndex(s => s.id == endSubSnippets[0].id)
    if (startSnippet.sentenceId == endSnippet.sentenceId) {
        //same sentence
        if (startSnippet == endSnippet) {
            //same snippet
            selectionSnippets = [endSubSnippets[0]]
        } else {
            //different snippets
            selectionSnippets = sentences[startSentenceIndex].snippets.slice(startSnippetIndexInSentence, endSnippetIndexInSentence + 1)
        }
    } else {
        const startSentenceSequenceNumber = sentences.findIndex(sentence => sentence.id == startSnippet.sentenceId)
        const endSentenceSequenceNumber = sentences.findIndex(sentence => sentence.id == endSnippet.sentenceId)
        selectionSnippets = sentences[startSentenceIndex].snippets.slice(startSnippetIndexInSentence) //copy start snippet plus rest of sentence
        for (let sentenceNr = startSentenceSequenceNumber + 1; sentenceNr < endSentenceSequenceNumber; sentenceNr++) {
            //add all snippets of intermediate sentences
            selectionSnippets = selectionSnippets.concat(sentences[sentenceNr].snippets)
        }
        //add all up and including end snippet
        selectionSnippets = selectionSnippets.concat(sentences[endSentenceIndex].snippets.slice(0, endSnippetIndexInSentence + 1))
    }
    return selectionSnippets
}

function splitSnippet(snippet, charIndex, sentences) {
    //TODO handle empty leftSnippet and/or rightSnippet, when charIndex == 0 or charIndex == snippet.text.length-1
    const leftSnippet = {
        id: snippet.id + "_0",
        sentenceId: snippet.sentenceId,
        annotations: [...snippet.annotations],
        text: snippet.text.substring(0, charIndex)
    }
    const rightSnippet = {
        id: snippet.id + "_1",
        sentenceId: snippet.sentenceId,
        annotations: [...snippet.annotations],
        text: snippet.text.substring(charIndex)
    }
    //replace original snippet in sentence with the two new ones
    const sentence = sentences.find(s => s.id == snippet.sentenceId)
    const snippetIndexInSentence = sentence.snippets.findIndex(s => s.id == snippet.id)
    sentence.snippets.splice(snippetIndexInSentence, 1, leftSnippet, rightSnippet)

    return [leftSnippet, rightSnippet]
}