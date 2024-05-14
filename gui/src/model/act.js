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

    get allowedSubTypesForActiveField() {
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
                return ['agent', 'action', 'object']
            case 'terminates':
                return ['agent', 'action', 'object']
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

    //check if any of the roles has this frame, if so, remove it
    deleteFrameFromRoles(frame) {
        if (this._action && this._action.id == frame.id) {
            this._action = null
        }
        if (this._actor && this._actor.id == frame.id) {
            this._actor = null
        }
        if (this._object && this._object.id == frame.id) {
            this._object = null
        }
        if (this._recipient && this._recipient.id == frame.id) {
            this._recipient = null
        }


        const indexCreates = this._creates.findIndex(f => f.id == frame.id)
        if (indexCreates != -1) {
            this._creates.splice(indexCreates, 1)
        }
        const indexTerminates = this._creates.findIndex(f => f.id == frame.id)
        if (indexTerminates != -1) {
            this._creates.splice(indexTerminates, 1)
        }
        //TODO boolean construct
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