import { Sentence } from "./sentence.js"

export class SourceDocument {
    constructor(jsonLdObject) {
        //console.log("selectedSentenceIds", selectedSentenceIds)
        const rootElement = jsonLdObject["@graph"].find((d) => d["@type"] == "src:Element")
        this._iri = rootElement["@id"]
        this._id = rootElement["@id"]
        this._title = ""
        this._sentenceTree = this.parseElementTree(rootElement)

        console.log("created source document", this)
    }

    get id() { return this._id }
    get iri() { return this._iri }
    get title() { return this._title }
    get sentenceTree() { return this._sentenceTree }

    //sentence tree as list
    get sentences() { return this._sentenceTree.sentenceTreeAsList }


    getSnippetsForAnnotation(annotation) {
        //check all snippets to see if they contain given annotation
        return this.sentences
            .map(s => s.snippets)
            .flat()
            .filter(snippet =>
                snippet.annotations.some(a => a.id == annotation.id)
            )
    }

    getAnnotationsForFrame(frame) {
        const annotations = this._sentences
            .map(s => s.snippets.map(snippet => snippet.annotations))
            .flat()
            .flat()
            .filter((annotation, index, array) => array.findIndex(a => a.id == annotation.id) === index)
        return annotations.filter(a => a.frame?.id == frame.id)
    }

    deleteAnnotationsForFrame(frame) {
        const annotations = this.getAnnotationsForFrame(frame)
        annotations.forEach(a => this.deleteAnnotation(a))
    }

    //remove annotation from snippets
    deleteAnnotation(annotation) {
        const snippets = this._sentences
            .map(s => s.snippets)
            .flat()
        snippets.forEach(s => s.deleteAnnotation(annotation))
    }

    //return all sentences that have snippets with annotations for frame
    getSentencesForFrame(frame) {
        return this.sentences.filter(sentence =>
            sentence.snippets.some(snippet => snippet.annotations.some(a => a.frame && a.frame.id == frame.id))
        )
    }

    //parse element into tree of sentences
    parseElementTree(element) {
        const sentence = new Sentence(element.id, this)
        if (element["@type"] == "src:Element") {
            sentence.parent = null
            sentence.contentType = "root"
            sentence.level = 0
            element.children.forEach(childElement => {
                const childSentence = this.parseElementTree(childElement)
                sentence.addChild(childSentence)
                childSentence.parent = sentence
                childSentence.level = 1
            })
        } else if (element.class == "src:NonLeafElement") {
            //content for this element is in one if its childs
            let headerChildElement = element.children.find(child => child.IRI == element.containsAsHeader)
            if (!headerChildElement) {
                headerChildElement = element.children[0]
            }
            sentence.addTextFromChopperLeafElement(headerChildElement.content)
            sentence.contentType = element.typelabel
            //add children, except the one that is the header child element
            element.children.forEach(childElement => {
                if (childElement != headerChildElement) {
                    const childSentence = this.parseElementTree(childElement)
                    sentence.addChild(childSentence)
                    childSentence.parent = sentence
                    childSentence.level = sentence.level + 1
                }
            })
        } else if (element.class == "src:LeafElement") {
            sentence.addTextFromChopperLeafElement(element.content)
            sentence.iri = element.IRI
            sentence.contentType = "leaf"
        }
        return sentence
    }
}
