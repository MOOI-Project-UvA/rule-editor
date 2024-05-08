//functions that return style for underlining pieces of text (snippets and sentences)
import { hexColors } from "./config.js";
const lineThickness = 3
const marginBottom = 20 //space between sentences
const charHeight = 14
//const highlightColor = "#c7dcee"
const white = "#ffffff"
const grey = "#666666"

export function getStyleForUnderlining(snippet, sentence) {
    //each annotation within a sentence gets its own vertical position
    const annotationsInSentence = sentence.snippets.map(snippet => snippet.annotations)
        .filter(annotations => annotations.length > 0)
        .flat()
        .filter((annotation, index, array) => array.findIndex(a => a.id == annotation.id) === index);

    //loop through all annotations for this sentence and see if this snippet
    //has the annotation. if so, add coloured line, if not, add white line
    let backgroundStyle = "linear-gradient(180deg"
    annotationsInSentence.forEach((annotation, annotationNumber) => {
        let lineColor
        console.log("annotationsInSentence", annotationsInSentence)
        if (snippet.annotations.some(a => a.id == annotation.id)) {
            if (annotation.frame) {
                lineColor = annotation.frame.subType
                    ? hexColors[annotation.frame.subType.id]
                    : hexColors[annotation.frame.type.id]
            } else {
                lineColor = grey
            }
        } else {
            lineColor = white
        }
        backgroundStyle +=
            `, ${white} ${annotationNumber * 2 * lineThickness}px`
            + `, ${lineColor} ${annotationNumber * 2 * lineThickness}px`
            + `, ${lineColor} ${(annotationNumber * 2 + 1) * lineThickness}px`
            + `, ${white} ${(annotationNumber * 2 + 1) * lineThickness}px`
    })
    backgroundStyle += ")"

    console.log("snippet", snippet, "backgroundStyle", backgroundStyle)

    const backgroundSize = annotationsInSentence.length == 0
        ? 0
        : (2 * annotationsInSentence.length - 1) * lineThickness

    //if snippet has annotation that is being edited: highlight text background
    //disabled for now: highlighting covers line beneath as well
    // const backgroundColor = annotationBeingEdited && snippet.annotations.some(a => a.id == annotationBeingEdited.id)
    //     ? highlightColor
    //     : "none"


    //backgroundStyle = "linear-gradient(180deg, #00ff00 2px, #ffffff 2px, #ffffff 4px, #ffff00 4px, #ffff00 6px, #ffffff 6px, #ffffff 8px, #ff00ff 8px, #ff00ff 10px, #ffffff 10px)"

    return {
        paddingBottom: `${backgroundSize + charHeight}px`, //determines how far upper line is from text
        background: backgroundStyle,
        backgroundSize: `100% ${backgroundSize}px`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0px",
        lineHeight: "21px"
        //backgroundColor: backgroundColor
    }

    const test = "linear-gradient(180deg, #007bc6 2px, #ffffff 2px, #ffffff 4px, #007bc6 4px, #007bc6 6px, #ffffff 6px, #ffffff 8px, #007bc6 8px, #007bc6 10px, #ffffff 10px)"
}

export function getStyleForLineSpacing(sentence) {
    const annotationIdsInSentence = sentence.snippets.map(s => s.annotations)
        .flat()
        .map(a => a.id)
        .filter((value, index, array) => array.indexOf(value) === index);
    const lineHeight = charHeight + annotationIdsInSentence.length * lineThickness * 2
    return {
        lineHeight: `${lineHeight}px`,
        marginBottom: `${marginBottom}px`
    }
}