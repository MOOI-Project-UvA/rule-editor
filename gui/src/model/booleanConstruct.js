export class BooleanConstruct {
    constructor() {
        this._frame = null // if _frame has a value, this BC is 'atomic', it has no children. Its value is a frame.
        this._isNegated = false
        this._children = [] // list of BooleanConstructs if _frame is null
        this._operatorToJoinChildren = null //"and" or "or"
        this._parent = null
        this._highlight = false
    }

    get isNegated() { return this._isNegated }
    set isNegated(isNegated) { this._isNegated = isNegated }

    get operatorToJoinChildren() { return this._operatorToJoinChildren }
    set operatorToJoinChildren(operator) { this._operatorToJoinChildren = operator }

    get children() { return this._children }

    get parent() { return this._parent }
    set parent(parent) { this._parent = parent }

    get level() { return this._parent ? this._parent.level + 1 : 0 }

    addChild(child) {
        this._children.push(child)
    }

    addEmptyChild() {
        let child = new BooleanConstruct()
        this._children.push(child)
        child.parent = this
    }

    removeChild(child) {
        const index = this._children.indexOf(child)
        if (index != -1) {
            this._children.splice(index, 1)
        }
    }

    addParent() {
        let newParent = new BooleanConstruct()
        const oldParent = this.parent
        //replace child of existing parent by new parent
        if (this.parent) {
            const index = this.parent.children.indexOf(this)
            oldParent.children[index] = newParent
            newParent.parent = oldParent
        }
        newParent.addChild(this)
        this.parent = newParent
    }

    get frame() { return this._frame }
    set frame(frame) { this._frame = frame }

    get isNegated() { return this._isNegated }
    set isNegated(isNegated) { this._isNegated = isNegated }

    removeFrame(frame) {
        if (this._frame == frame) {
            this._frame = null
            //remove itself from the children of the parent, unless
            //the parent is the top of the tree, and this is its last child
            if (this._parent) {
                if (this._parent.parent || this._parent.children.length > 1) {
                    const childIndex = this._parent.children.indexOf(this)
                    this._parent.children.splice(childIndex, 1)
                }
                if (this._parent.children.length <= 1) {
                    this._parent.operatorToJoinChildren = null
                }
            }
        } else {
            this._children.forEach(c => {
                c.removeFrame(frame)
            })
        }
    }

    //returns object with references to other frames by id
    toFlatObject() {
        return {
            frame: this.frame?.id,
            isNegated: this.isNegated,
            children: this._children
                .filter(c => c.frame || c.children.length > 0)
                .map(c => c.toFlatObject()),
            operatorToJoinChildren: this._operatorToJoinChildren
        }
    }

    //populate the attributes of this object with the given data
    fromFlatObject(bcData, allFrames) {
        this._frame = bcData.frame ? allFrames.find(f => f.id == bcData.frame) : null
        this._isNegated = bcData.isNegated
        this._operatorToJoinChildren = bcData.operatorToJoinChildren
        this._children = bcData.children.map(cData => {
            let child = new BooleanConstruct()
            //populate child with data
            child.fromFlatObject(cData, allFrames)
            child._parent = this
            return child
        })
    }
}