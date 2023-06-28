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

function getHtmlWithHighlights(text, highlights) {
    if (highlights.length > 0) {
        console.log("highlights", highlights)
    }
    //sort snippets from back of sentence to front
    //because inserting html-tags changes character positions
    highlights = highlights.sort((h1, h2) => h2.snippet.characterRange[1] - h1.snippet.characterRange[1])

    let htmlText = text

    highlights.forEach(highlight => {
        htmlText = htmlText.substring(0, highlight.snippet.characterRange[1])
            + "</span>"
            + htmlText.substring(highlight.snippet.characterRange[1])
        htmlText = htmlText.substring(0, highlight.snippet.characterRange[0])
            + '<span class="text-white bg-warning'
            //+ colors[highlight.annotation.tag]
            + '" style="cursor:pointer" @click="console.log(\'' + highlight.annotation.tag + '\')">'
            + htmlText.substring(highlight.snippet.characterRange[0])
    })
    return htmlText
}

export {
    getSelectedCharacterRange,
    getHtmlWithHighlights
}