//functions that return style for underlining pieces of text (snippets and sentences)

const colors = ["#007bc6", "#e17001", "#ffb611", "#f092cd"]
const lineThickness = 2
const marginBottom = 20 //space between sentences
const charHeight = 14

export function getStyleForUnderlining(snippet, sentence) {
    const white = "#ffffff"
    //each annotation within a sentence gets its own vertical position
    const annotationIdsInSentence = sentence.snippets.map(s => s.annotations)
        .flat()
        .map(a => a.id)
        .filter((value, index, array) => array.indexOf(value) === index);
    //loop through all annotations for this sentence and see if this snippet
    //has the annotation. if so, add coloured line, if not, add white line
    let backgroundStyle = "linear-gradient(180deg"
    annotationIdsInSentence.forEach((annotationId, annotationNumber) => {
        const lineColor = snippet.annotations.some(a => a.id == annotationId)
            ? "#007bc6" : white
        backgroundStyle +=
            `, ${white} ${annotationNumber * 2 * lineThickness}px`
            + `, ${lineColor} ${annotationNumber * 2 * lineThickness}px`
            + `, ${lineColor} ${(annotationNumber * 2 + 1) * lineThickness}px`
            + `, ${white} ${(annotationNumber * 2 + 1) * lineThickness}px`
    })
    backgroundStyle += ")"

    const backgroundSize = annotationIdsInSentence.length == 0
        ? 0
        : (2 * annotationIdsInSentence.length - 1) * lineThickness


    //backgroundStyle = "linear-gradient(180deg, #00ff00 2px, #ffffff 2px, #ffffff 4px, #ffff00 4px, #ffff00 6px, #ffffff 6px, #ffffff 8px, #ff00ff 8px, #ff00ff 10px, #ffffff 10px)"

    return {
        paddingBottom: `${backgroundSize + charHeight}px`, //determines how far upper line is from text
        background: backgroundStyle,
        backgroundSize: `100% ${backgroundSize}px`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0px"
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