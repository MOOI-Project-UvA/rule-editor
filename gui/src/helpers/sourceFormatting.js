const fontSizes = [
    16, //level 1
    14, //level 2
    14, //level 3
    12, //level 4
    12  //level 5
]

const defaultFontSize = 11

const fontWeights = [
    "bold", //level 1
    "bold", //level 2
    "bold", //level 3
    "bold", //level 4
    "bold"  //level 5
]

const defaultFontWeight = "normal"

const indentationPerLevel = 10

//font size and weight depends on level in tree, i.e. the depth of the sentence seen from the root
//if a sentence has no children, which means that it is not a header, it will get the default
//formatting, regardless of its level in the tree
//root has level zero. the root is not displayed, it has no content. its children are the headers at the
//first visible level

export function getStyleForSentenceFormat(sentence) {
    const level = sentence.level - 1 //
    const marginLeft = level * indentationPerLevel
    const fontSize = level >= fontSizes.length || sentence.children.length == 0 ? defaultFontSize : fontSizes[level]
    const fontWeight = level >= fontWeights.length || sentence.children.length == 0 ? defaultFontWeight : fontWeights[level]
    return {
        marginLeft: `${marginLeft}pt`,
        fontSize: `${fontSize}pt`,
        fontWeight: fontWeight
    }
}