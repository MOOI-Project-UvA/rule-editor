import { v4 as uuid4 } from 'uuid'
import { Annotation } from './annotation.js'

class Claimduty {
    constructor() {
        this._id = uuid4() //unique ID
        this._typeId = null
        this._subTypeId = null
        this._label = ""
        this._claimduty = ""
        this._activeField = null
        this._duty = null
        this._actor = null
        this._holder = null

        this._highlight = false
        this._comments = []

        this._annotations = [] //typically one annotation (unless claimduty is described multiple times in the source)
    }
    get id() { return this._id }
    set id(id) { this._id = id }

    get typeId() { return this._typeId }
    set typeId(typeId) { this._typeId = typeId }

    get label() {
        return this._label// && this._label.length > 0
        // ? this._label
        // : this.claimduty.length > 25
        //     ? this.claimduty.substring(0, 25) + "..."
        //     : this.claimduty
    }
    set label(label) { this._label = label }

    get claimduty() {
        return this._claimduty //.length > 0
        // ? this._claimduty
        // : constructClaimdutyLabel(this)
    }
    set claimduty(claimduty) { this._claimduty = claimduty }

    get activeField() { return this._activeField }
    set activeField(activeField) { this._activeField = activeField }

    get duty() { return this._duty }
    set duty(duty) { this._duty = duty }

    get actor() { return this._actor }
    set actor(actor) { this._actor = actor }

    get holder() { return this._holder }
    set holder(holder) { this._holder = holder }

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

    //check if any of the roles has this frame, if so, remove it
    deleteReferencesToFrame(frame) {
        if (this._duty && this._duty.id == frame.id) {
            this._duty = null
        }
        if (this._actor && this._actor.id == frame.id) {
            this._actor = null
        }
        if (this._holder && this._holder.id == frame.id) {
            this._holder = null
        }
    }

    get sourceText() { return this.annotations.length > 0 ? this.annotations[0].sourceText : "" }

    get sentences() {
        const sentences = this.annotations.map(a => a.snippets.map(s => s.sentence)).flat()
        sentences.sort((s1, s2) => {
            return (s1.id < s2.id)
                ? -1
                : s1.id > s2.id
                    ? 1
                    : 0
        })
        return sentences
    }

    get allowedSubTypesForActiveField() {
        switch (this._activeField) {
            case 'duty':
                return ['duty']
            case 'actor':
                return ['agent']
            case 'holder':
                return ['agent']
            default:
                return []
        }
    }

    get comments() { return this._comments }
    set comments(comments) { this._comments = comments }

    addFrame(fact) {
        //todo: replace this code with: this[this._activeField] = fact
        switch (this._activeField) {
            case 'duty':
                this._duty = fact
                break
            case 'actor':
                this._actor = fact
                break
            case 'holder':
                this._holder = fact
                break
        }
    }

    checkFrameExistance(claimduty, element) {
        const duty = claimduty._duty !== null && claimduty._duty._id === element._id ? true : false;
        const actor = claimduty._actor !== null && claimduty._actor._id == element._id
            ? true
            : false;
        const holder = claimduty._holder !== null && claimduty._holder._id == element._id
            ? true
            : false;

        const exist = [
            duty,
            actor,
            holder
        ];

        if (exist.some((d) => d)) {
            claimduty._highlight = false
        } else {
            claimduty._highlight = true
        }
        return exist.some((d) => d)
    }

    // returns the ids of the containing facts
    //TODO: do we need this? needs updating because precondition is a BooleanConstruct now
    get childrenIds() {
        const facts = [
            this._duty,
            this._actor,
            this._holder,
        ]

        return facts.filter(f => f).map(f => f._id)
    }

    toFlatObject() {
        return {
            id: this.id,
            typeId: this.typeId,
            label: this.label,
            claimduty: this.claimduty,
            dutyId: this.duty?.id,
            actorId: this.actor?.id,
            holderId: this.holder?.id,
            comments: this.comments.map(c => c.toFlatObject()),
        }
    }

    fromFlatObject(frameData, allFrames) {
        this._id = frameData.id
        this._label = frameData.label
        this._typeId = frameData.typeId
        this._subTypeId = null //claimduty has no subtype
        this._claimduty = frameData.claimduty
        this._duty = frameData.dutyId ? allFrames.find(f => f.id == frameData.dutyId) : null
        this._actor = frameData.actorId ? allFrames.find(f => f.id == frameData.actorId) : null
        this._holder = frameData.holderId ? allFrames.find(f => f.id == frameData.holderId) : null
        //annotations and comments are set in parseJsonToInterpretation in importExport.js
    }
}

//construct label [action] [object] [actor] [recipient]
function constructClaimdutyLabel(claimduty) {
    const dutyLabel = claimduty.duty ? claimduty.duty.label : '.'
    const actorLabel = claimduty.actor ? claimduty.actor.label : '.'
    const holderLabel = claimduty.holder ? claimduty.holder.label : '.'

    return `${dutyLabel} ${actorLabel} ${holderLabel}`
}

export {
    Claimduty
}