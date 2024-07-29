//class for storing nodes and links, used for visualization of an interpretation
import { v4 as uuid4 } from 'uuid'

export class Network {
    constructor() {
        this._nodes = []
        this._links = []
    }

    get nodes() { return this._nodes }
    get links() { return this._links }

    addNodesAndDependencyRelationsForActs(acts, expandedActs) {
        //add node for each act. add nodes for roles as well, when act is expanded.
        //(which is the case when the act is open in the editor)
        acts.forEach(act => this.addNodeForAct(act, expandedActs.some(a => a.id == act.id)))
        //ompare each act with each other act to see if there is a dependency.
        //this is the case when one act creates a frame that is part of the precondition
        //of the other act
        acts.forEach(targetAct => {
            const targetPreconditionFacts = targetAct.precondition.allFrames
            acts.forEach(sourceAct => {
                if (sourceAct.id != targetAct.id) {
                    //check if there is at least one frame created by the sourceAct
                    //that is part of the precondition of the targetAct
                    if (sourceAct.creates.some(createdFact =>
                        targetPreconditionFacts.some(targetFact => targetFact.id == createdFact.id)
                    )) {
                        this.addLink(sourceAct, targetAct, "dependency", "before")
                    }
                }
            })
        })
        //for each act, determine position in dependency-chain. this is used for positioning the acts
        //from left to right
        setSequenceOfActnodes(
            this._nodes.filter(n => n.type == "act"),
            this._links.filter(l => l.type == "dependency")
        )
    }

    //add node for act. relate act to existing nodes, if node is a role of the act.
    //add nodes for roles if 'addNodesForRoles' is true
    addNodeForAct(act, addNodesForRoles) {
        let actNode = this.getNode(act, true)
        console.log("actNode", actNode)
        //add nodes and links for roles with one frame
        const rolesWithOneFrame = ["action", "actor", "object", "recipient"]
        rolesWithOneFrame.forEach(roleAttribute => {
            if (act[roleAttribute]) {
                //if act has this role filled in, get corresponding node
                const roleNode = this.getNode(act[roleAttribute], addNodesForRoles)
                if (roleNode) {
                    this.addLink(actNode, roleNode, "role", roleAttribute)
                }
            }
        })
        //add nodes and links for roles with multiple frames
        const rolesWithMultipleFrames = ["creates", "terminates"]
        rolesWithMultipleFrames.forEach(roleAttribute => {
            //get nodes for this attribute, filter out empty nodes (which may happen if addNodesForRoles is false)
            const roleNodes = act[roleAttribute].map(frame => this.getNode(frame, addNodesForRoles)).filter(node => node)
            if (roleNodes.length == 1) {
                //only one frame in this property: create node and connect with act
                this.addLink(actNode, roleNodes[0], "role", roleAttribute)
            } else if (roleNodes.length > 1) {
                //multiple nodes for this property: add anonymous node
                const anonymousNode = this.createAnonymousNode("", "list") //label, subType
                this.addLink(actNode, anonymousNode, "role", roleAttribute)
                roleNodes.forEach(roleNode => {
                    this.addLink(anonymousNode, roleNode, "list", "") //source, target, linktype, label
                })
            }
        })
        //add nodes and links for boolean construct (precondition role)
        const booleanConstructNode = this.addNodesAndLinksForBooleanConstruct(act.precondition, addNodesForRoles)
        console.log(act.label, "booleanConstructNode", booleanConstructNode)
        if (booleanConstructNode) {
            this.addLink(actNode, booleanConstructNode, "role", "precondition") //source, target, linktype, label
        }
    }

    //creates tree of nodes for facts and operators in boolean construct
    //returns root node of the tree
    addNodesAndLinksForBooleanConstruct(booleanConstruct, addNodesForRoles) {
        //if BC has a frame, create corresponding node, else create an anonymous node
        if (booleanConstruct.frame) {
            console.log("getting node for", booleanConstruct.frame)
            return this.getNode(booleanConstruct.frame, addNodesForRoles)
        } else {
            //create nodes for children. If there are more than zero: create
            //anonymous node to connect them
            const childrenNodes = booleanConstruct.children
                .map(child => this.addNodesAndLinksForBooleanConstruct(child, addNodesForRoles))
                .filter(node => node)
            if (childrenNodes.length > 0) {
                const anonymousNode = this.createAnonymousNode(booleanConstruct.operatorToJoinChildren, "booleanConstruct")
                childrenNodes.forEach(node => {
                    this.addLink(anonymousNode, node, "booleanConstruct", "")
                })
                return anonymousNode
            } else {
                return null
            }
        }
    }

    //get node for frame. if there is not already a node for this frame,
    //create one, if 'createIfNotExists' is true
    getNode(frame, createIfNotExists) {
        let node = this._nodes.find(n => n.id == frame.id)
        if (!node && createIfNotExists) {
            node = {
                id: frame.id,
                label: frame.label,
                type: frame.typeId,
                subType: frame.subTypeId,
                sequenceIndex: null //index of act nodes in chain of dependency
            }
            this._nodes.push(node)
        }
        return node
    }

    createAnonymousNode(label, subType) {
        const node = {
            id: uuid4(),
            label: label,
            type: "anonymous",
            subType: subType,
            sequenceIndex: null
        }
        this._nodes.push(node)
        return node
    }

    addLink(sourceNode, targetNode, linkType, label) {
        //TODO: do we need to check if link is already there?
        this._links.push({
            source: sourceNode.id,
            target: targetNode.id,
            type: linkType, //TODO: needed?
            label: label
        })
    }

    printInConsole() {
        console.log("=== NODES ===")
        this._nodes.forEach(n => {
            console.log(n.label, n.type, n.subType, n.id)
        })
        console.log("=== LINKS ===")
        this._links.forEach(l => {
            console.log(l.label, l.type, l.source.id, l.target.id)
        })
    }
}

//assign sequence index to each act node, indicating how far in the sequence of dependencies this
//act is. we use this to position act nodes in the network, laying out chains of dependent acts
//from left to right.
function setSequenceOfActnodes(actNodes, dependencyLinks) {
    //start with act nodes that are at the beginning of a sequence
    const actNodesAtBeginning = actNodes.filter(act => !(dependencyLinks.some(link => link.target == act.id)))
    //set all sequence index values to null
    actNodes.forEach(actNode => { actNode.sequenceIndex = null })
    actNodesAtBeginning.forEach(actNode => {
        setSequenceIndexOfAct(actNode, 0, dependencyLinks, actNodes)
    })
}

function setSequenceIndexOfAct(actNode, newIndex, links, nodes) {
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
