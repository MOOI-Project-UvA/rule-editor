import { v4 as uuid4 } from 'uuid'
import { Annotation } from './annotation'
import { BooleanConstruct } from './booleanConstruct.js'

export class Fact {
    constructor() {
        this._id = uuid4() //unique ID
        this._label = "" //label as visible in the chip
        this._fact = "" //longer description of the fact
        this._type = null //type object (id, class, label)
        this._subType = null //optional subtype (id, class, label)
        this._annotations = [] //array of Annotation. Each annotation is an array of snippets
        this._comments = [] //comments from interpretor about this fact
        this._subdivision = new BooleanConstruct()
        this._isComplex = true
    }

    get id() { return this._id }
    set id(id) { this._id = id }

    get type() { return this._type }
    set type(type) { this._type = type }

    get subType() { return this._subType }
    set subType(subType) { this._subType = subType }

    get isComplex() { return this._isComplex }
    set isComplex(isComplex) { this._isComplex = isComplex }

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

    get subdivision() { return this._subdivision }
    set subdivision(subdivision) { this._subdivision = subdivision }

    get sourceText() { return this.annotations.length > 0 ? this.annotations[0].sourceText : "" }

    get comments() { return this._comments }

    get annotations() { return this._annotations }
    addAnnotation(annotation) {
        this._annotations = [...this._annotations, annotation]
        annotation.frame = this
    }

    removeAnnotation(annotation) {
        const index = this._annotations.indexOf(annotation)
        this._annotations.splice(index, 1)

    }

    toFlatObject() {
        return {
            id: this.id,
            label: this.label,
            fact: this.fact,
            typeId: this.type.id,
            subTypeId: this.subType ? this.subType.id : null,
            annotations: this.annotations.map(a => a.toFlatObject()),
            comments: this.comments,
            isComplex: this.isComplex,
            subdivision: this.subdivision.toFlatObject()
        }
    }

    //fiil frame with data
    fromFlatObject(data, allFrames) {
        this.label = data.label
        this.fact = data.fact
        if (data.subTypeId) {
            //this.type is instantiated in import.js
            //find corresponding subtype in type
            this.subType = this.type.subTypes.find(t => t.id == data.subTypeId)
        }
        data.annotations.forEach(a => {
            let annotation = new Annotation()
            annotation.fromFlatObject(a)
            this.addAnnotation(annotation)
        })
        this.isComplex = data.isComplex
        this.subdivision = new BooleanConstruct()
        this.subdivision.fromFlatObject(data.subdivision, allFrames)
    }
}

