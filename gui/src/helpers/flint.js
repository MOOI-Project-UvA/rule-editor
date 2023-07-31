import { Annotation } from '../model/annotation.js'
import { BooleanConstruct } from '../model/booleanConstruct.js'

// class Fact {
//   constructor() {
//     this._id = null //set when fact is saved
//     this._type = "fact"
//     this._label = ""
//     this._fact = "";
//     this._annotation = null;
//     this._booleanConstruct = null //optional subdivision of fact in smaller parts
//     this._booleanConstructBeingEdited = null //needed to know where to put a frame, if the user clicks a frame in the framelist
//     this._highlight = false
//     this._comments = []
//   }
//   get id() { return this._id }
//   set id(id) { this._id = id }

//   get annotation() { return this._annotation }
//   set annotation(annotation) { this._annotation = annotation }

//   get type() { return this._type }

//   get label() {
//     return this._label && this._label.length > 0
//       ? this._label
//       : this.fact.length > 65
//         ? this.fact.substring(0, 62) + "..."
//         : this.fact
//   }
//   set label(label) { this._label = label }

//   get fact() { return this._fact.length > 0 ? this._fact : this.sourceText }
//   set fact(fact) { this._fact = fact }

//   get booleanConstruct() { return this._booleanConstruct }
//   set booleanConstruct(booleanConstruct) { this._booleanConstruct = booleanConstruct }

//   //keep track of which (part of the) boolean construct the user is editing.
//   //when the user clicks a frame from the list, we know where to put that frame in
//   //the boolean construct 
//   set booleanConstructBeingEdited(booleanConstructBeingEdited) {
//     this._booleanConstructBeingEdited = booleanConstructBeingEdited
//   }

//   get comments() { return this._comments }

//   // called when the user clicked a frame in the frame list
//   addFrame(frame) {
//     if (this._booleanConstructBeingEdited) {
//       this._booleanConstructBeingEdited.frame = frame
//     }
//   }

//   toFlatObject() {
//     return {
//       id: this._id,
//       type: this._type,
//       label: this._label,
//       fact: this._fact,
//       annotation: this._annotation?.toFlatObject(),
//       booleanConstruct: this._booleanConstruct?.toFlatObject(),
//       comments: this._comments
//     }
//   }

//   //fills frame object with data from json frameData
//   //in flat data, frames in boolean construct are referenced by ID
//   //we need allFrames to convert those IDs to object references
//   fromFlatObject(frameData, allFrames) {
//     this._type = frameData.type
//     this._label = frameData.label
//     this._fact = frameData.fact

//     this._annotation = new Annotation(
//       frameData.annotation.documentId,
//       frameData.annotation.sentenceId,
//       frameData.annotation.characterRange,
//       frameData.annotation.annotatedText
//     )
//     this._annotation.tag = frameData.annotation.tag

//     if ('booleanConstruct' in frameData) {
//       this._booleanConstruct = new BooleanConstruct()
//       this._booleanConstruct.fromFlatObject(frameData.booleanConstruct, allFrames)
//     }

//     this._comments = frameData.comments

//   }

//   checkFrameExistance(element) {
//     const exist = []
//     if (this._booleanConstruct.children.length > 0) {
//       this.checkChildren(this._booleanConstruct, element, exist)
//     }

//     if (exist.some((d) => d)) {
//       this._highlight = false
//     } else {
//       this._highlight = true
//     }
//     return exist.some((d) => d)
//   }

//   checkChildren(pBc, element, exist) {
//     pBc.children.forEach(bc => {
//       if (bc._frame !== null) {
//         bc._frame._id === element._id ? exist.push(true) : exist.push(false);
//       } else {
//         this.checkChildren(bc, element, exist)
//       }
//     })
//   }
//   getChildren(pBc, listOfChildren) {
//     pBc.children.forEach(bc => {
//       if (bc._frame !== null) {
//         listOfChildren.push(bc._frame)
//       } else {
//         this.getChildren(bc, listOfChildren)
//       }
//     })
//     return listOfChildren.filter(d => d).map(d => d._id)
//   }
//   get retrieveChildrenIds() {
//     const listOfChildren = []
//     return this.getChildren(this._booleanConstruct, listOfChildren)
//   }
// }

class Act {
  constructor() {
    this._type = null
    this._label = ""
    this._act = ""
    this._activeField = "action"
    this._action = null
    this._actor = null
    this._object = null
    this._precondition = null
    this._recipient = null
    this._creates = []
    this._terminates = []
    this._id = null //set when fact is saved
    this._highlight = false
    this._comments = []
  }
  get id() { return this._id }
  set id(id) { this._id = id }

  get type() { return this._type }
  set type(type) { this._type = type }

  get label() {
    return this._label && this._label.length > 0
      ? this._label
      : this.act.length > 65
        ? this.act.substring(0, 62) + "..."
        : this.act
  }
  set label(label) { this._label = label }

  get act() { return this._act }
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

  get allowedSubClassesForActiveField() {
    switch (this._activeField) {
      case 'action':
        return ['action']
        break
      case 'actor':
        return ['agent']
        break
      case 'object':
        return ['object']
        break
      case 'recipient':
        return ['agent']
        break
      case 'precondition':
        return ['agent', 'action', 'object']
        break
      case 'creates':
        return ['agent', 'action', 'object']
        break
      case 'terminates':
        return ['agent', 'action', 'object']
        break;
    }
  }

  get sources() {
    const facts = [
      this._action,
      this._actor,
      this._object,
      this._precondition,
      this._recipient,
      ...this._creates,
      ...this._terminates
    ]
    return facts.filter(f => f)
      .map(f => f.sources).flat()
  }

  get comments() { return this._comments }

  addFrame(fact) {
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
      case 'precondition':
        this._precondition = fact
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

  //returns object with references to other frames by id
  toFlatObject() {
    return {
      id: this._id,
      type: this._type,
      label: this._label,
      act: this._act,
      action: this._action ? this._action.id : null,
      actor: this._actor ? this._actor.id : null,
      object: this._object ? this._object.id : null,
      precondition: this._precondition ? this._precondition.id : null,
      recipient: this._recipient ? this._recipient.id : null,
      creates: this._creates.map(f => f.id),
      terminates: this._terminates.map(f => f.id),
      comments: this._comments
    }
  }

  fromFlatObject(frameData, allFrames) {
    this._id = frameData.id
    this._type = frameData.type
    this._label = frameData.label
    this._act = frameData.act
    this._action = frameData.action ? allFrames.find(f => f.id == frameData.action) : null
    this._actor = frameData.actor ? allFrames.find(f => f.id == frameData.actor) : null
    this._object = frameData.object ? allFrames.find(f => f.id == frameData.object) : null
    this._precondition = frameData.precondition ? allFrames.find(f => f.id == frameData.precondition) : null
    this._recipient = frameData.recipient ? allFrames.find(f => f.id == frameData.recipient) : null
    this._creates = frameData.creates.map(id => allFrames.find(f => f.id == id))
    this._terminates = frameData.terminates.map(id => allFrames.find(f => f.id == id))
    this._comments = frameData.comments
  }
  checkFrameExistance(act, element) {

    console.log("act", act)
    console.log("element", element)

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
    console.log("exist in Act:", exist)
    return exist.some((d) => d)


  }

  // returns the ids of the containing facts
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
}

class ClaimDuty {
  constructor() { }
}

export {
  Act,
  ClaimDuty
}
