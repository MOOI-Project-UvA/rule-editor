import { v4 as uuid4 } from 'uuid'

const idPrefix = "http://ontology.tno.nl/normengineering/editor#task-"

export class Task {
    constructor() {
        this._id = `${idPrefix}${uuid4()}`
        this._type = "Task"
        this._description = ""
        this._label = ""
    }

    get id() { return this._id }
    set id(id) { this._id = id } //id is overwritten when reading existing interpretation

    get type() { return this._type }

    get label() { return this._label }
    set label(label) { this._label = label }

    get description() { return this._description }
    set description(description) { this._description = description }
}