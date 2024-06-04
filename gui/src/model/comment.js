import { v4 as uuid4 } from 'uuid'

export class Comment {
    constructor() {
        this._id = uuid4() //unique ID
        this._content = ""; //the actual content (text) of the comment
        this._author = null; //id of the user that created this comment
        this._timestamp = null; //date and time of creation or change of this comment
    }

    get content() { return this._content }
    set content(content) { this._content = content }

    // for the time being, a comment is saved as a flat string (its content), no other fields are stored
    toFlatObject() {
        return this._content
    }

    // a comment is a string, which is the content of the comment. user and timestamp are not yet stored
    fromFlatObject(content) {
        this._content = content
    }
}