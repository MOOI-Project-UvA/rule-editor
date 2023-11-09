import { v4 as uuid4 } from 'uuid'
import { BooleanConstruct } from './booleanConstruct.js'

class Claimduty {
    constructor() {
        this._id = uuid4() //unique ID
        this._type = null //{id, class, label}
        this._subType = null
        this._label = ""
        this._claimduty = ""
        this._activeField = null
        this._duty = null
        this._actor = null
        this._holder = null

        this._highlight = false
        this._comments = []

        this._annotations = [] //typically one annotation (unless act is described multiple times in the source)
    }
    get id() { return this._id }
    set id(id) { this._id = id }

    get type() { return this._type }
    set type(type) { console.log("setting type to", type); this._type = type }

    get label() {
        return this._label && this._label.length > 0
            ? this._label
            : this.act.length > 25
                ? this.act.substring(0, 25) + "..."
                : this.act
    }
    set label(label) { this._label = label }

    get claimduty() {
        return this._claimduty.length > 0
            ? this._claimduty
            : constructActLabel(this)
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

    get allowedSubClassesForActiveField() {
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

    //returns object with references to other frames by id
    toFlatObject() {
        return {
            id: this._id,
            type: this._type,
            label: this._label,
            claimduty: this._claimduty,
            duty: this._duty ? this._duty.id : null,
            actor: this._actor ? this._actor.id : null,
            holder: this._holder ? this._holder.id : null,
            comments: this._comments
        }
    }

    fromFlatObject(frameData, allFrames) {
        this._id = frameData.id
        this._label = frameData.label
        this._claimduty = frameData.claimduty
        this._duty = frameData.duty ? allFrames.find(f => f.id == frameData.duty) : null
        this._actor = frameData.actor ? allFrames.find(f => f.id == frameData.actor) : null
        this._holder = frameData.holder ? allFrames.find(f => f.id == frameData.holder) : null
        this._comments = frameData.comments
    }
    checkFrameExistance(act, element) {
        const duty = act._duty !== null && act._duty._id === element._id ? true : false;
        const actor = act._actor !== null && act._actor._id == element._id
            ? true
            : false;
        const holder = act._holder !== null && act._holder._id == element._id
            ? true
            : false;

        const exist = [
            duty,
            actor,
            holder
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
            this._duty,
            this._actor,
            this._holder,
        ]

        return facts.filter(f => f).map(f => f._id)
    }

    toFlatObject() {
        return {
            id: this.id,
            typeId: this.type.id, //type is an object {id, class, label}
            label: this.label,
            claimduty: this.claimduty,
            dutyId: this.duty?.id, //take frame id instead of frame object
            actorId: this.actor?.id,
            holderId: this.holder?.id,
            comments: this.comments,
            annotations: this.annotations.map(a => a.toFlatObject())
        }
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