import { v4 as uuid4 } from 'uuid'
import { BooleanConstruct } from './booleanConstruct.js'

export class Fact {
    constructor() {
        this._id = uuid4() //unique ID
        this._label = "" //label as visible in the chip
        this._fact = "" //longer description of the fact
        this._type = null
        this._annotations = [] //array of Annotation. Each annotation is an array of snippets
        this._booleanConstruct = null //optional subdivision of fact in other facts. Of type BooleanConstruct
        //this._booleanConstructBeingEdited = null //needed to know where to put a frame, if the user clicks a frame in the framelist. TODO put in store, because it is about the state of the program
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

    get sourceText() { return this._annotations.map(a => a.sourceText).join(" ") }

    get booleanConstruct() { return this._booleanConstruct }

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

    subdivide() {
        this._booleanConstruct = new BooleanConstruct()
    }

    removeSubdivision() {
        this._booleanConstruct = null
    }

    // go through the document and look for occurences of the annotation text. Add those as annotations for this fact
    addSimilarAnnotations(document) {
        console.log("looking for similar annotations")
    }
}

