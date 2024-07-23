import { v4 as uuid4 } from 'uuid'
import { hexColorsLight } from "./config"

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

export function getBooleanConstructAsNodesAndLinks(booleanConstruct) {
    //if BC has a frame, create corresponding node, else create an anonymous node
    const frame = booleanConstruct.frame
    let nodes = []
    let links = []
    if (frame) {
        nodes = [{
            id: frame.id,
            label: frame.label,
            typeId: frame.typeId,
            subtypeId: frame.subTypeId,
            color: frame.subTypeId ? hexColorsLight[frame.subTypeId] : hexColorsLight[frame.typeId],
            radius: 5
        }]
    } else if (booleanConstruct.children.length > 0) {
        //create anonamous node
        const anonymousNode = {
            id: booleanConstruct.id,
            label: booleanConstruct.operatorToJoinChildren,
            typeId: "anonymous",
            subtypeId: "booleanConstruct",
            color: hexColorsLight["anonymous"],
            radius: 3
        }
        nodes = [anonymousNode]
        booleanConstruct.children.forEach(child => {
            const childNodesAndLinks = getBooleanConstructAsNodesAndLinks(child)
            //first node in list is root, i.e. node corresponding to child
            links.push({
                source: anonymousNode.id,
                target: childNodesAndLinks.nodes[0],
                type: "bc",
                color: "#ffffff",
                drawArrow: false
            })
            nodes = nodes.concat(childNodesAndLinks.nodes)
            links = links.concat(childNodesAndLinks.links)
        })
    }
    return { nodes: nodes, links: links }
}

export function getFrameListAsNodesAndLinks(frameList) {
    let nodes = []
    let links = []
    if (frameList.length > 0) {
        if (frameList.length == 1) {
            nodes = [{
                id: frameList[0].id,
                label: frameList[0].label,
                typeId: frameList[0].typeId,
                subtypeId: frameList[0].subTypeId,
                color: frameList[0].subTypeId ? hexColorsLight[frameList[0].subTypeId] : hexColorsLight[frameList[0].typeId],
                radius: 5
            }]
        } else {
            //create anonymous node to which all list items are connected
            const anonymousNode = {
                id: uuid4(),
                label: "",
                typeId: "anonymous",
                subtypeId: "list",
                color: hexColorsLight["anonymous"],
                radius: 3
            }
            nodes.push(anonymousNode)
            frameList.forEach(frame => {
                const node = {
                    id: frame.id,
                    label: frame.label,
                    typeId: frame.typeId,
                    subtypeId: frame.subTypeId,
                    color: frame.subTypeId ? hexColorsLight[frame.subTypeId] : hexColorsLight[frame.typeId],
                    radius: 5
                }
                nodes.push(node)
                links.push({
                    source: anonymousNode.id,
                    target: node.id,
                    type: "list",
                    color: "#ffffff",
                    drawArrow: false
                })
            })
        }


    }
    return { nodes: nodes, links: links }
}

//assign sequence index to each act node, indicating how far in the sequence of dependencies this
//act is. we use this to position act nodes in the network, laying out chains of dependent acts
//from left to right.
export function setSequenceOfActnodes(network) {
    //start with act nodes that are at the beginning of a sequence
    const actNodes = network.nodes.filter(node => node.typeId == "act")
    const dependencyLinks = network.links.filter(link => link.type == "dependency")
    const actNodesAtBeginning = actNodes.filter(act => !(dependencyLinks.some(link => link.target == act.id)))
    //set all sequence index values to null
    actNodes.forEach(actNode => { actNode.sequenceIndex = null })
    actNodesAtBeginning.forEach(actNode => {
        setSequenceIndexOfAct(actNode, 0, dependencyLinks, actNodes)
    })
    console.log("actNodes", actNodes)
}


export function setSequenceIndexOfAct(actNode, newIndex, links, nodes) {
    //an act may be reached via different paths
    //set index to max of current index (if any) and newIndex
    if ((!(actNode.sequenceIndex)) || actNode.sequenceIndex < newIndex) {
        actNode.sequenceIndex = newIndex
        //follow outgoing relations only
        const outgoingLinks = links.filter(l => l.source == actNode.id)
        outgoingLinks.forEach(link => {
            const nextActNode = nodes.find(n => n.id == link.target)
            setSequenceIndexOfAct(nextActNode, newIndex + 1, links, nodes)
        })
    }
}