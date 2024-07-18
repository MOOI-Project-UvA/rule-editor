
//get relations between acts, where the precondition of one act is dependent on the postcondition
//of another act
export function getDependencyRelationsBetweenActs(frameList) {
    let dependencies = []
    //derive links between Acts
    //get node-link structure, where nodes are frames, and links mean that frames are related:
    //a frame is (part of) a role in an act or claim duty
    const acts = frameList.filter(f => f.typeId == "act")
    //compare each act with all other acts to see if they are connected
    acts.forEach(targetAct => {
        const targetPreconditionFacts = targetAct.precondition.allFrames
        acts.forEach(sourceAct => {
            if (sourceAct.id != targetAct.id) {
                //get all facts that are created by the source act, and are part of the
                //precondition for the target act
                //if there is any such fact, there is a dependency
                const dependencyFacts = sourceAct.creates.filter(createdFact =>
                    targetPreconditionFacts.some(targetFact => targetFact.id == createdFact.id)
                )
                if (dependencyFacts.length > 0) {
                    dependencies.push({
                        sourceAct: sourceAct,
                        targetAct: targetAct,
                        dependencyFacts: dependencyFacts
                    })
                }
            }
        })
    })
    return dependencies
}

