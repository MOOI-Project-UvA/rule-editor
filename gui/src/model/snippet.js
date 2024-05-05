import { v4 as uuid4 } from 'uuid'

export class Snippet {
    constructor(text) {
        this._id = uuid4() //unique ID
        this._text = text
        this._annotations = []
    }
    get id() { return this._id }
    get text() { return this._text }
    get annotations() { return this._annotations }
}

