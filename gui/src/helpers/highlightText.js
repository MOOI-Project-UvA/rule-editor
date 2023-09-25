import { colors } from "./config.js"

// see: https://stackoverflow.com/questions/65640736/get-start-and-end-postion-of-a-text-selection-with-sourrounded-elements
function getSelectedCharacterRange(sentenceElement, selection) {
    const indexRangeStart = Math.min(selection.anchorOffset, selection.focusOffset)
    const indexRangeEnd = Math.max(selection.anchorOffset, selection.focusOffset)
    let indexRange = []
    if (selection.getRangeAt && selection.rangeCount) {
        const range = selection.getRangeAt(0);
        const allNodes = sentenceElement.childNodes
        const previousNode = range.startContainer
        const index = [...allNodes].indexOf(previousNode)
        let offset = 0
        for (let i = 0; i < index; i++) {
            const node = allNodes[i]
            offset += node.nodeName == "#text"
                ? node.nodeValue.length
                : node.innerText.length //span element
        }
        indexRange = [indexRangeStart + offset, indexRangeEnd + offset]
    }
    return indexRange
}

function getHtmlWithHighlights(text, snippets) {
    //sort snippets from back of sentence to front
    //because inserting html-tags changes character positions

    snippets = snippets.sort((s1, s2) => s2.characterRange[1] - s1.characterRange[1])

    let htmlText = text

    snippets.forEach(snippet => {
        const frameType = snippet.annotation.frame ? snippet.annotation.frame.type : null
        const color = frameType ? colors[frameType.id] : 'grey-6'
        htmlText = htmlText.substring(0, snippet.characterRange[1])
            + "</span>"
            + htmlText.substring(snippet.characterRange[1])
        htmlText = htmlText.substring(0, snippet.characterRange[0])
            + '<span '
            + 'id="' + snippet.id //each snippet has a uuid
            + '" class="text-white bg-'
            + color
            + '" style="cursor:pointer">'
            + htmlText.substring(snippet.characterRange[0])
    })
    return htmlText
}

export {
    getSelectedCharacterRange,
    getHtmlWithHighlights
}