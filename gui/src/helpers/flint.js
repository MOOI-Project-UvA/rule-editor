class AtomicFact {
  constructor() {
    this._type = "fact"
    this._name = "";
    this._annotation = null;
    this._id = null //set when fact is saved
  }
  get id() { return this._id }
  set id(id) { this._id = id }

  get annotation() { return this._annotation }
  set annotation(annotation) { this._annotation = annotation }

  get type() { return this._type }

  get name() { return this._name.length > 0 ? this._name : this._annotation.annotatedText }
  set name(name) { this._name = name }

  get subClass() { //derived from annotation tag
    return this._annotation.tag
  }

  get sources() {
    return [this._annotation]
  }

  toFlatObject() {
    return {
      id: this._id,
      type: this._type,
      name: this._name,
      annotation: this._annotation.toFlatObject()
    }
  }

  //fills frame object with data from json frameData
  //annotations will be added separately
  fillWithData(frameData) {
    this._name = frameData.name
    const annotation = new Annotation(
      frameData.annotation.documentId,
      frameData.annotation.sentenceId,
      frameData.annotation.characterRange,
      frameData.annotation.annotatedText
    )
    annotation.frame = this
    annotation.tag = frameData.annotation.tag
    this._annotation = annotation

  }
}

class ComplexFact {
  constructor() {
    this._type = "complexFact"
    this._name = ""
    this._operator = "and" //default value
    this._factList = []
    this._id = null //set when fact is saved
  }
  get id() { return this._id }
  set id(id) { this._id = id }

  get type() { return this._type }
  get subClass() { return this._subClass }

  get name() { return this._name }
  set name(name) { this._name = name }

  get operator() { return this._operator }
  set operator(operator) { this._operator = operator }

  get factList() { return this._factList }
  set factList(factList) { this._factList = factList }

  get sources() {
    return this._factList.map(f => f.sources).flat()
  }

  addFrame(fact) {
    this._factList.push(fact)
  }

  removeFrame(fact) {
    console.log("from object: remove", fact)
    const index = this._factList.indexOf(fact)
    if (index != -1) {
      this._factList.splice(index, 1)
    }
  }

  //returns object with references to other frames by id
  toFlatObject() {
    return {
      id: this._id,
      type: this._type,
      subClass: this.subClass,
      name: this._name,
      operator: this._operator,
      factList: this._factList.map(f => f.id)
    }
  }

  //fill frame with data in frameData: frameData has references by ID, those
  //need to be replaced by references to objects. FramesDict is a lookup-table
  //to get a frame by ID
  fillWithData(frameData, allFrames) {
    console.log("fillWithData", frameData, allFrames)
    this._subClass = frameData.subClass
    this._name = frameData.name
    this._operator = frameData.operator
    this._factList = frameData.factList.map(id => allFrames.find(f => f.id == id))
  }
}

class Act {
  constructor() {
    this._type = "act"
    this._name = ""
    this._activeField = ""
    this._action = null
    this._actor = null
    this._object = null
    this._precondition = null
    this._recipient = null
    this._creates = []
    this._terminates = []
    this._id = null //set when fact is saved
  }
  get id() { return this._id }
  set id(id) { this._id = id }

  get type() { return this._type }

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
        return ['action', 'other', 'complex']
        break
      case 'actor':
        return ['agent', 'other', 'complex']
        break
      case 'object':
        return ['object', 'other', 'complex']
        break
      case 'recipient':
        return ['agent', 'other', 'complex']
        break
      case 'precondition':
        return ['agent', 'action', 'object', 'other', 'complex']
        break
      case 'creates':
        return ['agent', 'action', 'object', 'other', 'complex']
        break
      case 'terminates':
        return ['agent', 'action', 'object', 'other', 'complex']
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
    console.log("facts", facts)
    return facts.filter(f => f)
      .map(f => f.sources).flat()
  }

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
      name: this._name,
      action: this._action ? this._action.id : null,
      actor: this._actor ? this._actor.id : null,
      object: this._object ? this._object.id : null,
      precondition: this._precondition ? this._precondition.id : null,
      recipient: this._recipient ? this._recipient.id : null,
      creates: this._creates.map(f => f.id),
      terminates: this._terminates.map(f => f.id)
    }
  }

  fillWithData(frameData, allFrames) {
    console.log("fillWithData", frameData, allFrames)
    this._name = frameData.name
    this._action = frameData.action ? allFrames.find(f => f.id == frameData.action) : null
    this._actor = frameData.actor ? allFrames.find(f => f.id == frameData.actor) : null
    this._object = frameData.object ? allFrames.find(f => f.id == frameData.object) : null
    this._precondition = frameData.precondition ? allFrames.find(f => f.id == frameData.precondition) : null
    this._recipient = frameData.recipient ? allFrames.find(f => f.id == frameData.recipient) : null
    this._creates = frameData.creates.map(id => allFrames.find(f => f.id == id))
    this._terminates = frameData.terminates.map(id => allFrames.find(f => f.id == id))
  }
}

class Annotation {
  constructor(documentId, sentenceId, characterRange, annotatedText) {
    this._documentId = documentId
    this._sentenceId = sentenceId
    this._characterRange = characterRange
    this._annotatedText = annotatedText
    this._tag = null
    this._frame = null
    this._positionOnScreen = null
  }
  get documentId() { return this._documentId }
  get sentenceId() { return this._sentenceId }

  get annotatedText() { return this._annotatedText }
  set annotatedText(annotatedText) { this._annotatedText = annotatedText }

  get characterRange() { return this._characterRange }
  set characterRange(characterRange) { this._characterRange = characterRange }

  get positionOnScreen() { return this._positionOnScreen }
  set positionOnScreen(positionOnScreen) { this._positionOnScreen = positionOnScreen }

  get tag() { return this._tag }
  set tag(tag) { this._tag = tag }

  get frame() { return this._frame }
  set frame(frame) { this._frame = frame }

  //returns flat object, with references to other objects by ID
  toFlatObject() {
    return {
      documentId: this._documentId,
      sentenceId: this._sentenceId,
      characterRange: this._characterRange,
      annotatedText: this._annotatedText,
      frameId: this._frame.id,
      tag: this._tag
    }
  }
}


export {
  AtomicFact,
  ComplexFact,
  Act,
  Annotation
}
