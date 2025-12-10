import { Node } from "./node.js"
import { Link } from "./link.js"

export class Network {
    constructor(frameList) {
        console.log("Network - constructor")

        const networkFromFrames = createNetwork(frameList)
        this._nodes = networkFromFrames.nodes;
        this._links = networkFromFrames.links;

        presetNodePositions(this._nodes)
    }

    get nodes() { return this._nodes }
    get links() { return this._links } // do we need this? we could construct this from all outgoing links from the nodes

    set nodes(nodes) { this._nodes = nodes }

    addNode(frame) {
        //check if frame is already in network. if so, do not add node.
        if (!this._nodes.some(n => n.frame.id == frame.id)) {
            console.log("adding node")
            let node = new Node()
            node.frame = frame
            //this frame is a fact (because all acts and claimDuties have been permanently added to the network)
            //check if this frame is part of any other frame
            this._nodes.forEach(otherNode => {
                if (["act", "claimDuty"].includes(otherNode.frame.typeId)) {
                    ["actor", "action", "object", "recipient", "duty", "claimant", "holder"].forEach(role => {
                        if (role in otherNode.frame && otherNode.frame[role] && otherNode.frame[role].id == frame.id) {
                            const link = new Link(node, otherNode, role, false)
                            this._links.push(link)
                            otherNode.incomingLinks.push(link)
                            node.outgoingLinks.push(link)
                        }
                    })
                } else {
                    //other node is a fact. check if new node is part of its subdivision
                    if (otherNode.frame.allFrames.map(f => f.id).includes(frame.id)) {
                        const link = new Link(node, otherNode, "subdivision", false)
                        this._links.push(link)
                        otherNode.incomingLinks.push(link)
                        node.outgoingLinks.push(link)
                    } else if (frame.allFrames.map(f => f.id).includes(otherNode.frame.id)) {
                        const link = new Link(otherNode, node, "subdivision", false)
                        this._links.push(link)
                        otherNode.outgoingLinks.push(link)
                        node.incomingLinks.push(link)
                    }
                }
                // if (otherNode.frame.allFrames.map(f => f.id).includes(frame.id)) {
                //     const link = new Link(node, otherNode, "", false)
                //     this._links.push(link)
                //     otherNode.outgoingLinks.push(link)
                //     node.incomingLinks.push(link)
                // }
            })
            this._nodes.push(node)
            this.nodes = [...this.nodes]
        } else {
            //remove node
        }
    }
    deleteNode(frame) {
        const node = this._nodes.find(n => n.frame.id == frame.id)
        console.log("deleting node", node, "frame", frame)
        if (node) {
            const nodeIndex = this._nodes.findIndex(n => n.id == node.id)
            if (nodeIndex != -1) {
                this._nodes.splice(nodeIndex, 1)
            }
            //remove links to and from this node
            node.outgoingLinks.concat(node.incomingLinks).forEach(link => {
                const index = this._links.findIndex(l => l.id == link.id)
                if (index != -1) {
                    this._links.splice(index, 1)
                }
            })
            this.nodes = [...this.nodes]
        }
    }
}

function createNetwork(frameList) {
    const roleAttributes = ["actor", "action", "object", "recipient", "duty", "claimant", "holder"]
    const relationFrames = frameList.filter(f => ["act", "claim_duty"].includes(f.typeId))
    // create nodes for Act and ClaimDuty frames
    const nodes = relationFrames.map(f => {
        let node = new Node()
        node.frame = f
        return node
    })
    let links = []
    //go through all pairs of relationNodes, and see which frame affects the other
    //source can be acts only, since claim-duty frames have no postcondition

    nodes.filter(n => n.frame.typeId == "act").forEach(source => {
        //get ids of all frames, created by source. Include frames that are indirectly created by source,
        //this happens when a frame is part of a subdivision of a frame that is created by source
        const sourceCreatesFrameIds = source.frame.creates.map(f => f.allFrames).flat().map(f => f.id)
        nodes.forEach(target => {
            //get ids of all facts that are part of the target's precondition, including facts that
            //are part of subdivisions. only acts have preconditions.
            const targetPreconditionFactIds = target.frame.typeId == "act"
                ? target.frame.precondition.allFrames.map(f => f.id)
                : []
            //get ids of all facts that are part of a role of the target, including subdivisons
            //for both acts and claimDuty frames
            const targetRoleFactIds = roleAttributes.map(role => target.frame[role]
                ? target.frame[role].allFrames.map(f => f.id)
                : [])
                .flat()
            //get ids of frames terminated by source. include subdivisions. only acts can terminate frames.
            const targetTerminatesFramesIds = target.frame.typeId == "act"
                ? target.frame.terminates.map(f => f.allFrames).flat().map(f => f.id)
                : []
            //if any of these ids is created by the source, there is a link between target and source
            const targetFactIds = [...targetPreconditionFactIds, ...targetRoleFactIds, ...targetTerminatesFramesIds]
            if (sourceCreatesFrameIds.some(createdFrameId => targetFactIds.includes(createdFrameId))) {
                const link = new Link(source, target, "affects", true) // directed
                links.push(link)
                source.outgoingLinks.push(link)
                target.incomingLinks.push(link)
            }
        })
    })
    return { nodes: nodes, links: links }
}




//position acts that have no incoming affect links to the top of the screen
//position acts that have no outgoing affect links to the bottom of the screen
function presetNodePositions(nodes) {
    console.log("presetNodePositions")
    const topNodes = nodes.filter(n => n.incomingLinks.length == 0 && n.outgoingLinks.length > 0)
    const bottomNodes = nodes.filter(n => n.outgoingLinks.length == 0 && n.incomingLinks.length > 0)
    topNodes.forEach(n => n.fy = -500)
    bottomNodes.forEach(n => n.fy = 500)
}

function isConnected(frameFrom, frameTo) {

}


