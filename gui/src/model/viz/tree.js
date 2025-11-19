// {label: label, children: [], icon: ...}
import { Node } from "./node.js"
import { Link } from "./link.js"

export class Tree {
    constructor(obj) {
        this._root = getTreeForFactOrBooleanConstruct(obj)
    }

    get root() { return this._root }
}


function getTreeForFactOrBooleanConstruct(obj) {
    console.log("getTreeForFactOrBooleanConstruct | obj", obj)
    let node = null
    if ("typeId" in obj && obj.typeId == "fact") {
        node = new Node()
        node.frame = obj
        let subdivisionNode = getTreeForFactOrBooleanConstruct(obj.subdivision)
        if (subdivisionNode) {
            const link = new Link(node, subdivisionNode, "subdivision", false)
            node.outgoingLinks.push(link)
            subdivisionNode.incomingLinks.push(link)
        }
    } else {
        //obj is boolean construct
        //if (!obj.isEmpty) {
        if (obj.frame) {
            node = getTreeForFactOrBooleanConstruct(obj.frame)
        } else if (obj.children.length == 1) {
            //unary operation. we assume negation for now
            //do not create a separate boolean node, but set the negated prop of the child node to true
            node = getTreeForFactOrBooleanConstruct(obj.children[0])
            node.negated = true
        } else if (obj.children.length > 0) {
            node = new Node()
            node.operator = obj.operatorToJoinChildren
            obj.children.forEach(child => {
                let childNode = getTreeForFactOrBooleanConstruct(child)
                const link = new Link(node, childNode, "boolean", false)
                node.outgoingLinks.push(link)
                childNode.incomingLinks.push(link)
            })
        }
        //}

    }
    return node
}