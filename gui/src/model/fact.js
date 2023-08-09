import { v4 as uuid4 } from 'uuid'

export class Fact {
    constructor() {
        this._id = uuid4() //unique ID
        this._label = "" //label as visible in the chip
        this._fact = "" //longer description of the fact
        this._type = null //type object (id, class, label)
        this._annotations = [] //array of Annotation. Each annotation is an array of snippets
        this._booleanConstruct = null //optional subdivision of fact in other facts. Of type BooleanConstruct
        this._comments = [] //comments from interpretor about this fact
    }

    get id() { return this._id }
    set id(id) { this._id = id }

    get type() { return this._type }
    set type(type) { this._type = type }

    get label() {
        return this._label && this._label.length > 0
            ? this._label
            : this.fact.length > 25
                ? this.fact.substring(0, 25) + "..."
                : this.fact
    }
    set label(label) { this._label = label }

    get fact() { return this._fact.length > 0 ? this._fact : this.sourceText }
    set fact(fact) { this._fact = fact }

    get sourceText() { return this.annotations.length > 0 ? this.annotations[0].sourceText : "" }

    get comments() { return this._comments }

    get annotations() { return this._annotations }
    addAnnotation(annotation) {
        console.log("adding annotation", annotation, "to frame", this)
        this._annotations = [...this._annotations, annotation]
        annotation.frame = this
    }

    removeAnnotation(annotation) {
        const index = this._annotations.indexOf(annotation)
        this._annotations.splice(index, 1)

    }
}

