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
        frame.id = d.id
        frames.push(frame)
    })
    //fill with data and replace references by ID with reference to object
    frameData.forEach(d => {
        let frame = frames.find(f => f.id == d.id)
        frame.fillWithData(d, frames)
    })
    console.log("frames", frames)

    //read source texts that are used by this interpretation
    const annotations = frames.filter(f => f.type == "fact").map(f => f.annotation)
    const documentIds = annotations
        .map(a => a.documentId)
        .filter((value, index, array) => array.indexOf(value) === index); //keep unique values
    documentIds.forEach(docId => {
        store.dispatch("addSource", docId)
    })
    return frames
}

export {
    parseJsonToFrames
}