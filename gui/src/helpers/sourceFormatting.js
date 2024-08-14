const fontSizePerContentType = {
    'Hoofdstuk': 16,
    'Afdeling': 14,
    'Artikel': 12,
    'Paragraaf': 12,
}

const defaultFontSize = 11

const fontWeightPerContentType = {
    'Hoofdstuk': "bold",
    'Afdeling': "bold",
    'Artikel': "bold",
    'Paragraaf': "bold",
}

const defaultFontWeight = "normal"

export function getStyleForSentenceFormat(sentence) {
    return {
        marginLeft: `${(sentence.level - 1) * 10}pt`,
        fontSize: `${sentence.contentType in fontSizePerContentType ? fontSizePerContentType[sentence.contentType] : defaultFontSize}pt`,
        fontWeight: `${sentence.contentType in fontWeightPerContentType ? fontWeightPerContentType[sentence.contentType] : defaultFontWeight}`
    }
}