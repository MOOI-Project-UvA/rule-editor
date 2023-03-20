import { colors } from "./config.js"

// see: https://stackoverflow.com/questions/65640736/get-start-and-end-postion-of-a-text-selection-with-sourrounded-elements
function getSelectedCharacterRange(sentenceElement, selection) {
    const rangeStart = Math.min(selection.anchorOffset, selection.focusOffset)
    const rangeEnd = Math.max(selection.anchorOffset, selection.focusOffset)
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
        return [rangeStart + offset, rangeEnd + offset]
    }
}

function getHtmlWithHighlights(text, annotations) {
    let htmlText = text
    //from back to front of sentence, because inserting html-tags
    //changes character positions
    annotations = annotations.sort((a1, a2) => a2.characterRange[1] - a1.characterRange[1])
    annotations.forEach(annotation => {
        htmlText = htmlText.substring(0, annotation.characterRange[1])
            + "</span>"
            + htmlText.substring(annotation.characterRange[1])
        htmlText = htmlText.substring(0, annotation.characterRange[0])
            + '<span class="text-white bg-'
            + colors[tag]
            + '" style="cursor:pointer">'
            + htmlText.substring(annotation.characterRange[0])
    })
    return htmlText
}

export {
    getSelectedCharacterRange,
    getHtmlWithHighlights
}