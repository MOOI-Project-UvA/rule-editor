import { colors } from "./config.js"

function getHtmlWithHighlights(text, annotations) {
    let htmlText = text
    //from back to front of sentence, because inserting html-tags
    //changes character positions
    annotations = annotations.sort((a1, a2) => a2.characterRange[1] - a1.characterRange[1])
    annotations.forEach(annotation => {
        const className = "text-white bg-" + colors[annotation.tag]
        htmlText = htmlText.substring(0, annotation.characterRange[1]) + "</span>" + htmlText.substring(annotation.characterRange[1])
        htmlText = htmlText.substring(0, annotation.characterRange[0]) + "<span class='" + className + "'>" + htmlText.substring(annotation.characterRange[0])
    })
    return htmlText
}

export {
    getHtmlWithHighlights
}