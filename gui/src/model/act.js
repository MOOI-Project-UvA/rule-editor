import { v4 as uuid4 } from 'uuid'
import { BooleanConstruct } from './booleanConstruct.js'
import { Annotation } from './annotation.js'

class Act {
    constructor() {
        this._id = uuid4() //unique ID
        this._type = null //{id, class, label}
        this._subType = null
        this._label = ""
        this._act = ""
        this._activeField = null
        this._action = null
        this._actor = null
        this._object = null
        this._precondition = new BooleanConstruct()
        //this._precondition.addEmptyChild()
        this._recipient = null
        this._creates = []
        this._terminates = []

        this._highlight = false
        this._comments = []

        this._annotations = [] //typically one annotation (unless act is described multiple times in the source)
    }
    get id() { return this._id }
    set id(id) { this._id = id }

    get type() { return this._type }
    set type(type) { this._type = type }

    get label() {
        return this._label //&& this._label.length > 0
        // ? this._label
        // : this.act.length > 25
        //     ? this.act.substring(0, 25) + "..."
        //     : this.act
    }
    set label(label) { this._label = label }

    get act() {
        return this._act
        // ? this._act
        // : constructActLabel(this)
    }
    set act(act) { this._act = act }

    get activeField() { return this._activeField }
    set activeField(activeField) { this._activeField = activeField }

    get action() { return this._action }
    set action(action) { this._action = action }

    get actor() { return this._actor }
    set actor(actor) { this._actor = actor }

    get object() { return this._object }
    set object(object) { this._object = object }

    get precondition() { return this._precondition }
    set precondition(precondition) { this._precondition = precondition }

    get recipient() { return this._recipient }
    set recipient(recipient) { this._recipient = recipient }

    get creates() { return this._creates }
    set creates(creates) { this._creates = creates }

    get terminates() { return this._terminates }
    set terminates(terminates) { this._terminates = terminates }

    //TODO these methods are also present in fact and claim-duty.
    //maybe use a super-class 'frame' and add them there
    get annotations() { return this._annotations }
    addAnnotation(annotation) {
        this._annotations = [...this._annotations, annotation]
        annotation.frame = this
    }
    removeAnnotation(annotation) {
        const index = this._annotations.indexOf(annotation)
        this._annotations.splice(index, 1)
    }

    get sourceText() { return this.annotations.length > 0 ? this.annotations[0].sourceText : "" }

    //based on sentenceId and documentId from each snippet, retrieve the sentence object from the source
    getSentences(sourceDocs) {
        const snippets = this._annotations.map(a => a.snippets).flat()
        //group snippets according to document
        const snippetsPerDoc = Object.groupBy(snippets, s => s.documentId)
        console.log("snippetsPerDoc", snippetsPerDoc)
        let sentences = []
        Object.entries(snippetsPerDoc).forEach(([docId, snippetsInDoc]) => {
            console.log("snippetsInDoc", snippetsInDoc)
            //get sentence object for each snippet from the current document
            const doc = sourceDocs.find(d => d.id == docId)
            let sentencesForSnippets = snippetsInDoc
                .map(snippet => doc.sentences.find(s => s.id == snippet.sentenceId))
            sentencesForSnippets.sort((s1, s2) => s1.orderId - s2.orderId)
            sentences = sentences.concat(sentencesForSnippets)
        })
        console.log("sentences", sentences)
        return sentences
    }

    get allowedSubClassesForActiveField() {
        switch (this._activeField) {
            case 'action':
                return ['action']
            case 'actor':
                return ['agent']
            case 'object':
                return ['object']
            case 'recipient':
                return ['agent']
            case 'creates':
                return ['agent', 'action', 'object', 'other']
            case 'terminates':
                return ['agent', 'action', 'object', 'other']
            default:
                return []
        }
    }

    get comments() { return this._comments }

    addFrame(fact) {
        //todo: replace this code with: this[this._activeField] = fact
        switch (this._activeField) {
            case 'action':
                this._action = fact
                break
            case 'actor':
                this._actor = fact
                break
            case 'object':
                this._object = fact
                break
            case 'recipient':
                this._recipient = fact
                break
            case 'creates':
                this._creates.push(fact)
                break
            case 'terminates':
                this._terminates.push(fact)
                break;
        }
    }




    checkFrameExistance(act, element) {
        const term = act._terminates.find((d) => act._id === element._id) ? true : false;
        const creates = act._creates.find((d) => act._id === element._id) ? true : false;
        const action = act._action !== null && act._action._id === element._id ? true : false;
        const actor = act._actor !== null && act._actor._id == element._id
            ? true
            : false;
        const object = act._object !== null && act._object._id == element._id
            ? true
            : false;
        const precondition = act._precondition !== null && act._precondition._id == element._id
            ? true
            : false;
        const recipient = (act._recipient !== null && act._recipient._id == element._id)
            ? true
            : false;

        const exist = [
            term,
            creates,
            action,
            actor,
            object,
            precondition,
            recipient,
        ];

        if (exist.some((d) => d)) {
            act._highlight = false
        } else {
            act._highlight = true
        }
        return exist.some((d) => d)
    }

    // returns the ids of the containing facts
    //TODO: do we need this? needs updating because precondition is a BooleanConstruct now
    get childrenIds() {
        const facts = [
            this._action,
            this._actor,
            this._object,
            this._precondition,
            this._recipient,
            ...this._creates,
            ...this._terminates
        ]

        return facts.filter(f => f).map(f => f._id)
    }

    toFlatObject() {
        return {
            id: this.id,
            typeId: this.type.id, //type is an object {id, class, label}
            label: this.label,
            act: this.act,
            actionId: this.action?.id, //take frame id instead of frame object
            actorId: this.actor?.id,
            objectId: this.object?.id,
            precondition: this.precondition.toFlatObject(), //boolean construct
            recipientId: this.recipient?.id,
            creates: this.creates.map(f => f.id),
            terminates: this.terminates.map(f => f.id),
            comments: this.comments,
            annotations: this.annotations.map(a => a.toFlatObject())
        }
    }

    fromFlatObject(frameData, allFrames) {
        this._id = frameData.id
        this._label = frameData.label
        //this._type is instantiated in importExport.js
        this._act = frameData.act
        this._action = frameData.actionId ? allFrames.find(f => f.id == frameData.actionId) : null
        this._actor = frameData.actorId ? allFrames.find(f => f.id == frameData.actorId) : null
        this._object = frameData.objectId ? allFrames.find(f => f.id == frameData.objectId) : null
        this._precondition = new BooleanConstruct()
        this._precondition.fromFlatObject(frameData.precondition, allFrames)
        this._recipient = frameData.recipientId ? allFrames.find(f => f.id == frameData.recipientId) : null
        this._creates = frameData.creates.map(id => allFrames.find(f => f.id == id))
        this._terminates = frameData.terminates.map(id => allFrames.find(f => f.id == id))
        this._comments = frameData.comments
        frameData.annotations.forEach(a => {
            let annotation = new Annotation()
            annotation.fromFlatObject(a)
            this.addAnnotation(annotation)
        })
    }
}

//construct label [action] [object] [actor] [recipient]
function constructActLabel(act) {
    const actLabel = act.action ? act.action.label : '.'
    const objectLabel = act.object ? act.object.label : '.'
    const actorLabel = act.actor ? act.actor.label : '.'
    const recipientLabel = act.recipient ? act.recipient.label : '.'

    return `${actLabel} ${objectLabel} ${actorLabel} ${recipientLabel}`
}

export {
    Act
}