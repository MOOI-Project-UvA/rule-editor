import { AtomicFact, ComplexFact, Act } from './flint.js'
import { store } from "../store/index.js"

function parseJsonToFrames(jsonText) {
    let frameData = JSON.parse(jsonText)
    let frames = []

    frameData.forEach(d => {
        let frame
        //create empty frame of correct type
        switch (d.type) {
            case 'fact':
                frame = new AtomicFact()
                break
            case 'complexFact':
                frame = new ComplexFact()
                break
            case 'act':
                frame = new Act()
                break
        }
        //we need to assign id's here, and not via fillWithData, because fillWithData uses the list of frames with id's
        frame.id = d.id
        frames.push(frame)
    })
    //fill with data and replace references by ID with reference to object
    frameData.forEach(d => {
        let frame = frames.find(f => f.id == d.id)
        frame.fromFlatObject(d, frames)
    })

    //read source texts that are used by this interpretation
    const annotations = frames.filter(f => f.type == "fact").map(f => f.annotation)
    const documentIds = annotations
        .map(a => a.documentId)
        .filter((value, index, array) => array.indexOf(value) === index) //keep unique values
        .filter(docId => docId) //filter out empty doc ids (coming from annotations without a source)
    documentIds.forEach(docId => {
        store.dispatch("addSource", docId)
    })
    return frames
}

export {
    parseJsonToFrames
}