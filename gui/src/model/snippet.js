import { v4 as uuid4 } from 'uuid'

export class Snippet {
    constructor(text, sentence) {
        this._id = uuid4() //unique ID
        this._sentence = sentence
        this._text = text
        this._annotations = []
    }
    get id() { return this._id }
    get text() { return this._text }
    get annotations() { return this._annotations }
    get sentence() { return this._sentence }

    addAnnotation(annotation) {
        this._annotations = [...this._annotations, annotation]
        //annotation.addSnippet(this)
    }

    deleteAnnotation(annotation) {
        const index = this._annotations.findIndex(a => a.id == annotation.id)
        if (index != -1) {
            this._annotations.splice(index, 1)
            this._annotations = [...this._annotations]
        }
    }

    toFlatObject() {
        return {
            text: this.text,
        };
    }

    fromFlatObject(data) {
        //the sentence object will be retrieved based on documentId and sentenceId
        //in import.js
        this._text = data.text;
    }
}

