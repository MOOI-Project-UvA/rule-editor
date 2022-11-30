function createAtomicFact(fact, subClass, annotation) {
  return {
    type: 'fact',
    subClass: subClass,
    fact: fact,
    function: "",
    source: annotation
  }
}

function createComplexFact(fact) {
  return {
    type: 'fact',
    subClass: 'complex',
    fact: fact,
    operator: null, //and, or, not (null: not filled in yet)
    factList: [] //facts that operator applies to
  }
}

export {
  createAtomicFact,
  createComplexFact
}
//TODO: create a class for each type of frame
