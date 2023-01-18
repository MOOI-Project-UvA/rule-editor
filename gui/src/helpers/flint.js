
function createComplexFact(fact) {
  return {
    type: 'fact',
    subClass: 'complex',
    fact: fact,
    operator: null, //and, or, not (null: not filled in yet)
    factList: [] //facts that operator applies to
  }
}


class AtomicFact {
  constructor(name, annotation) {
    this._type = "fact"
    this._name = name;
    this._annotation = annotation;
  }
  get type() { return this._type }
  get name() { return this._name }
  set name(name) { this._name = name }
  get subClass() { //derived from annotation tag
    const tag = this._annotation.body
      .find(b => ('purpose' in b) && b.purpose == 'tagging')
      .value
    const subType = tag.toLowerCase()
    return subType
  }
  get sources() {
    return [this._annotation]
  }
}

class ComplexFact {
  constructor() {
    this._type = "complexFact"
    this._name = ""
    this._operator = null
    this._factList = []
  }
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
  }

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
}

export {
  createComplexFact,
  AtomicFact,
  ComplexFact,
  Act
}
//TODO: create a class for each type of frame
